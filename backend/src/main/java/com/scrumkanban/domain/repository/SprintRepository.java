package com.scrumkanban.domain.repository;

import com.scrumkanban.domain.model.Sprint;

import java.util.List;
import java.util.Optional;

public interface SprintRepository {

    Optional<Sprint> findById(Long id);

    List<Sprint> findByProjectId(Long projectId);

    Optional<Sprint> findActiveByProjectId(Long projectId);

    Sprint save(Sprint sprint);

    void deleteById(Long id);
}
