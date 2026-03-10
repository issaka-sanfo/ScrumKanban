package com.scrumkanban.application.usecases;

import com.scrumkanban.application.dto.DashboardDto;
import com.scrumkanban.application.dto.SprintMetricsDto;
import com.scrumkanban.domain.model.Sprint;
import com.scrumkanban.domain.model.SprintStatus;
import com.scrumkanban.domain.model.Task;
import com.scrumkanban.domain.model.TaskStatus;
import com.scrumkanban.domain.repository.ProjectRepository;
import com.scrumkanban.domain.repository.SprintRepository;
import com.scrumkanban.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardUseCase {

    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;

    public DashboardDto getDashboard(Long userId) {
        int totalProjects = projectRepository.findByOwnerId(userId).size()
                + projectRepository.findByMemberId(userId).size();

        // Deduplicate project count
        long uniqueProjectCount = java.util.stream.Stream.concat(
                projectRepository.findByOwnerId(userId).stream(),
                projectRepository.findByMemberId(userId).stream()
        ).map(p -> p.getId()).distinct().count();

        List<Sprint> allSprints = projectRepository.findByOwnerId(userId).stream()
                .flatMap(project -> sprintRepository.findByProjectId(project.getId()).stream())
                .collect(Collectors.toList());

        List<Sprint> activeSprints = allSprints.stream()
                .filter(s -> s.getStatus() == SprintStatus.ACTIVE)
                .collect(Collectors.toList());

        int myTasksCount = taskRepository.findByAssigneeId(userId).size();

        List<SprintMetricsDto> sprintMetrics = activeSprints.stream()
                .map(sprint -> getSprintMetrics(sprint.getId()))
                .collect(Collectors.toList());

        return DashboardDto.builder()
                .totalProjects((int) uniqueProjectCount)
                .activeSprintsCount(activeSprints.size())
                .myTasksCount(myTasksCount)
                .sprintMetrics(sprintMetrics)
                .build();
    }

    public SprintMetricsDto getSprintMetrics(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", sprintId));

        List<Task> tasks = taskRepository.findBySprintId(sprintId);

        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count();

        int totalStoryPoints = tasks.stream()
                .filter(t -> t.getStoryPoints() != null)
                .mapToInt(Task::getStoryPoints)
                .sum();

        int completedStoryPoints = tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE && t.getStoryPoints() != null)
                .mapToInt(Task::getStoryPoints)
                .sum();

        Map<String, Integer> tasksByStatus = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            int count = (int) tasks.stream()
                    .filter(t -> t.getStatus() == status)
                    .count();
            tasksByStatus.put(status.name(), count);
        }

        return SprintMetricsDto.builder()
                .sprintId(sprintId)
                .sprintName(sprint.getName())
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .totalStoryPoints(totalStoryPoints)
                .completedStoryPoints(completedStoryPoints)
                .tasksByStatus(tasksByStatus)
                .build();
    }
}
