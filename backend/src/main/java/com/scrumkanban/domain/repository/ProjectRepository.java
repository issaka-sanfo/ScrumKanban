package com.scrumkanban.domain.repository;

import com.scrumkanban.domain.model.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository {

    Optional<Project> findById(Long id);

    List<Project> findAll();

    List<Project> findByOwnerId(Long ownerId);

    List<Project> findByMemberId(Long memberId);

    Project save(Project project);

    void deleteById(Long id);
}
