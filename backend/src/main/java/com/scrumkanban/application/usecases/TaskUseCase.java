package com.scrumkanban.application.usecases;

import com.scrumkanban.application.dto.CreateTaskRequest;
import com.scrumkanban.application.dto.LabelDto;
import com.scrumkanban.application.dto.TaskDto;
import com.scrumkanban.application.dto.UpdateTaskRequest;
import com.scrumkanban.application.dto.UpdateTaskStatusRequest;
import com.scrumkanban.application.dto.UserDto;
import com.scrumkanban.application.mappers.LabelMapper;
import com.scrumkanban.application.mappers.TaskMapper;
import com.scrumkanban.application.mappers.UserMapper;
import com.scrumkanban.domain.model.Label;
import com.scrumkanban.domain.model.Priority;
import com.scrumkanban.domain.model.Task;
import com.scrumkanban.domain.model.TaskStatus;
import com.scrumkanban.domain.model.User;
import com.scrumkanban.domain.repository.CommentRepository;
import com.scrumkanban.domain.repository.LabelRepository;
import com.scrumkanban.domain.repository.SprintRepository;
import com.scrumkanban.domain.repository.TaskRepository;
import com.scrumkanban.domain.repository.UserRepository;
import com.scrumkanban.domain.service.TaskDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskUseCase {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final LabelRepository labelRepository;
    private final SprintRepository sprintRepository;
    private final CommentRepository commentRepository;
    private final TaskDomainService taskDomainService;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;
    private final LabelMapper labelMapper;

    public TaskDto createTask(CreateTaskRequest request, Long reporterId) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.BACKLOG)
                .priority(Priority.valueOf(request.getPriority()))
                .storyPoints(request.getStoryPoints())
                .sprintId(request.getSprintId())
                .projectId(request.getProjectId())
                .reporterId(reporterId)
                .assigneeIds(request.getAssigneeIds() != null ? new HashSet<>(request.getAssigneeIds()) : new HashSet<>())
                .labelIds(request.getLabelIds() != null ? new HashSet<>(request.getLabelIds()) : new HashSet<>())
                .build();

        if (task.getStoryPoints() != null) {
            taskDomainService.validateStoryPoints(task.getStoryPoints());
        }

        Task saved = taskRepository.save(task);
        return enrichTaskDto(saved);
    }

    public TaskDto updateTask(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            task.setPriority(Priority.valueOf(request.getPriority()));
        }
        if (request.getStoryPoints() != null) {
            taskDomainService.validateStoryPoints(request.getStoryPoints());
            task.setStoryPoints(request.getStoryPoints());
        }
        if (request.getSprintId() != null) {
            task.setSprintId(request.getSprintId());
        }
        if (request.getAssigneeIds() != null) {
            task.setAssigneeIds(new HashSet<>(request.getAssigneeIds()));
        }
        if (request.getLabelIds() != null) {
            task.setLabelIds(new HashSet<>(request.getLabelIds()));
        }

        Task saved = taskRepository.save(task);
        return enrichTaskDto(saved);
    }

    public TaskDto updateTaskStatus(Long id, UpdateTaskStatusRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        TaskStatus newStatus = TaskStatus.valueOf(request.getStatus());

        if (!taskDomainService.validateStatusTransition(task.getStatus(), newStatus)) {
            throw new IllegalStateException(
                    "Invalid status transition from " + task.getStatus() + " to " + newStatus);
        }

        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);
        return enrichTaskDto(saved);
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        return enrichTaskDto(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksBySprint(Long sprintId) {
        return taskRepository.findBySprintId(sprintId).stream()
                .map(this::enrichTaskDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::enrichTaskDto)
                .collect(Collectors.toList());
    }

    public void deleteTask(Long id) {
        taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        taskRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getMyTasks(Long userId) {
        return taskRepository.findByAssigneeId(userId).stream()
                .map(this::enrichTaskDto)
                .collect(Collectors.toList());
    }

    private TaskDto enrichTaskDto(Task task) {
        TaskDto dto = taskMapper.toDto(task);

        // Resolve reporter name
        if (task.getReporterId() != null) {
            userRepository.findById(task.getReporterId())
                    .ifPresent(reporter -> dto.setReporterName(reporter.getFullName()));
        }

        // Resolve assignees
        List<UserDto> assignees = task.getAssigneeIds().stream()
                .map(userRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        dto.setAssignees(assignees);

        // Resolve labels
        List<LabelDto> labels = task.getLabelIds().stream()
                .map(labelRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(labelMapper::toDto)
                .collect(Collectors.toList());
        dto.setLabels(labels);

        // Resolve comment count
        dto.setCommentCount(commentRepository.findByTaskId(task.getId()).size());

        return dto;
    }
}
