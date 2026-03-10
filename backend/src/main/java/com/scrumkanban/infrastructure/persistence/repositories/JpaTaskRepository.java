package com.scrumkanban.infrastructure.persistence.repositories;

import com.scrumkanban.domain.model.TaskStatus;
import com.scrumkanban.infrastructure.persistence.entities.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JpaTaskRepository extends JpaRepository<TaskEntity, Long> {

    List<TaskEntity> findBySprintId(Long sprintId);

    List<TaskEntity> findByProjectId(Long projectId);

    @Query("SELECT t FROM TaskEntity t JOIN t.assignees a WHERE a.id = :assigneeId")
    List<TaskEntity> findByAssigneeId(@Param("assigneeId") Long assigneeId);

    List<TaskEntity> findBySprintIdAndStatus(Long sprintId, TaskStatus status);
}
