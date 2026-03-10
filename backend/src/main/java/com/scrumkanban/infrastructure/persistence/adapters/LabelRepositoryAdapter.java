package com.scrumkanban.infrastructure.persistence.adapters;

import com.scrumkanban.domain.model.Label;
import com.scrumkanban.domain.repository.LabelRepository;
import com.scrumkanban.infrastructure.persistence.entities.LabelEntity;
import com.scrumkanban.infrastructure.persistence.entities.ProjectEntity;
import com.scrumkanban.infrastructure.persistence.repositories.JpaLabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class LabelRepositoryAdapter implements LabelRepository {

    private final JpaLabelRepository jpaLabelRepository;

    @Override
    public Optional<Label> findById(Long id) {
        return jpaLabelRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Label> findByProjectId(Long projectId) {
        return jpaLabelRepository.findByProjectId(projectId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Label save(Label label) {
        LabelEntity entity = toEntity(label);
        LabelEntity saved = jpaLabelRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        jpaLabelRepository.deleteById(id);
    }

    private Label toDomain(LabelEntity entity) {
        return Label.builder()
                .id(entity.getId())
                .name(entity.getName())
                .color(entity.getColor())
                .projectId(entity.getProject().getId())
                .build();
    }

    private LabelEntity toEntity(Label label) {
        ProjectEntity projectRef = ProjectEntity.builder()
                .id(label.getProjectId())
                .build();

        return LabelEntity.builder()
                .id(label.getId())
                .name(label.getName())
                .color(label.getColor())
                .project(projectRef)
                .build();
    }
}
