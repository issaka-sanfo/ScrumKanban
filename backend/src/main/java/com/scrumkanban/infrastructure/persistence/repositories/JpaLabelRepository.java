package com.scrumkanban.infrastructure.persistence.repositories;

import com.scrumkanban.infrastructure.persistence.entities.LabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaLabelRepository extends JpaRepository<LabelEntity, Long> {

    List<LabelEntity> findByProjectId(Long projectId);
}
