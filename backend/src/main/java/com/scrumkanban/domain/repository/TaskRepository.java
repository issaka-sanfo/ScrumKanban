package com.scrumkanban.domain.repository;

import com.scrumkanban.domain.model.Task;
import com.scrumkanban.domain.model.TaskStatus;

import java.util.List;
import java.util.Optional;

public interface TaskRepository {

    Optional<Task> findById(Long id);

    List<Task> findBySprintId(Long sprintId);

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findBySprintIdAndStatus(Long sprintId, TaskStatus status);

    Task save(Task task);

    void deleteById(Long id);
}
