package com.scrumkanban.infrastructure.persistence.adapters;

import com.scrumkanban.domain.model.Sprint;
import com.scrumkanban.domain.model.SprintStatus;
import com.scrumkanban.domain.repository.SprintRepository;
import com.scrumkanban.infrastructure.persistence.entities.ProjectEntity;
import com.scrumkanban.infrastructure.persistence.entities.SprintEntity;
import com.scrumkanban.infrastructure.persistence.repositories.JpaSprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class SprintRepositoryAdapter implements SprintRepository {

    private final JpaSprintRepository jpaSprintRepository;

    @Override
    public Optional<Sprint> findById(Long id) {
        return jpaSprintRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Sprint> findByProjectId(Long projectId) {
        return jpaSprintRepository.findByProjectId(projectId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Sprint> findActiveByProjectId(Long projectId) {
        return jpaSprintRepository.findByProjectIdAndStatus(projectId, SprintStatus.ACTIVE)
                .map(this::toDomain);
    }

    @Override
    public Sprint save(Sprint sprint) {
        SprintEntity entity = toEntity(sprint);
        SprintEntity saved = jpaSprintRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        jpaSprintRepository.deleteById(id);
    }

    private Sprint toDomain(SprintEntity entity) {
        return Sprint.builder()
                .id(entity.getId())
                .name(entity.getName())
                .goal(entity.getGoal())
                .projectId(entity.getProject().getId())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private SprintEntity toEntity(Sprint sprint) {
        ProjectEntity projectRef = ProjectEntity.builder()
                .id(sprint.getProjectId())
                .build();

        return SprintEntity.builder()
                .id(sprint.getId())
                .name(sprint.getName())
                .goal(sprint.getGoal())
                .project(projectRef)
                .startDate(sprint.getStartDate())
                .endDate(sprint.getEndDate())
                .status(sprint.getStatus())
                .createdAt(sprint.getCreatedAt())
                .build();
    }
}
