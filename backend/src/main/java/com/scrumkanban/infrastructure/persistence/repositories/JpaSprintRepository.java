package com.scrumkanban.infrastructure.persistence.repositories;

import com.scrumkanban.domain.model.SprintStatus;
import com.scrumkanban.infrastructure.persistence.entities.SprintEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JpaSprintRepository extends JpaRepository<SprintEntity, Long> {

    List<SprintEntity> findByProjectId(Long projectId);

    Optional<SprintEntity> findByProjectIdAndStatus(Long projectId, SprintStatus status);
}
