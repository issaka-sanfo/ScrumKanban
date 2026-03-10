package com.scrumkanban.infrastructure.persistence.adapters;

import com.scrumkanban.domain.model.Task;
import com.scrumkanban.domain.model.TaskStatus;
import com.scrumkanban.domain.repository.TaskRepository;
import com.scrumkanban.infrastructure.persistence.entities.*;
import com.scrumkanban.infrastructure.persistence.repositories.JpaTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class TaskRepositoryAdapter implements TaskRepository {

    private final JpaTaskRepository jpaTaskRepository;

    @Override
    public Optional<Task> findById(Long id) {
        return jpaTaskRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Task> findBySprintId(Long sprintId) {
        return jpaTaskRepository.findBySprintId(sprintId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Task> findByProjectId(Long projectId) {
        return jpaTaskRepository.findByProjectId(projectId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Task> findByAssigneeId(Long assigneeId) {
        return jpaTaskRepository.findByAssigneeId(assigneeId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Task> findBySprintIdAndStatus(Long sprintId, TaskStatus status) {
        return jpaTaskRepository.findBySprintIdAndStatus(sprintId, status).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Task save(Task task) {
        TaskEntity entity = toEntity(task);
        TaskEntity saved = jpaTaskRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        jpaTaskRepository.deleteById(id);
    }

    private Task toDomain(TaskEntity entity) {
        Set<Long> assigneeIds = new HashSet<>();
        if (entity.getAssignees() != null) {
            assigneeIds = entity.getAssignees().stream()
                    .map(UserEntity::getId)
                    .collect(Collectors.toSet());
        }

        Set<Long> labelIds = new HashSet<>();
        if (entity.getLabels() != null) {
            labelIds = entity.getLabels().stream()
                    .map(LabelEntity::getId)
                    .collect(Collectors.toSet());
        }

        return Task.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .priority(entity.getPriority())
                .storyPoints(entity.getStoryPoints())
                .sprintId(entity.getSprint() != null ? entity.getSprint().getId() : null)
                .projectId(entity.getProject().getId())
                .reporterId(entity.getReporter().getId())
                .assigneeIds(assigneeIds)
                .labelIds(labelIds)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private TaskEntity toEntity(Task task) {
        SprintEntity sprintRef = null;
        if (task.getSprintId() != null) {
            sprintRef = SprintEntity.builder()
                    .id(task.getSprintId())
                    .build();
        }

        ProjectEntity projectRef = ProjectEntity.builder()
                .id(task.getProjectId())
                .build();

        UserEntity reporterRef = UserEntity.builder()
                .id(task.getReporterId())
                .build();

        Set<UserEntity> assigneeEntities = new HashSet<>();
        if (task.getAssigneeIds() != null) {
            assigneeEntities = task.getAssigneeIds().stream()
                    .map(id -> UserEntity.builder().id(id).build())
                    .collect(Collectors.toSet());
        }

        Set<LabelEntity> labelEntities = new HashSet<>();
        if (task.getLabelIds() != null) {
            labelEntities = task.getLabelIds().stream()
                    .map(id -> LabelEntity.builder().id(id).build())
                    .collect(Collectors.toSet());
        }

        return TaskEntity.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .storyPoints(task.getStoryPoints())
                .sprint(sprintRef)
                .project(projectRef)
                .reporter(reporterRef)
                .assignees(assigneeEntities)
                .labels(labelEntities)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
