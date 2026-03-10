package com.scrumkanban.application.usecases;

import com.scrumkanban.application.dto.CreateLabelRequest;
import com.scrumkanban.application.dto.LabelDto;
import com.scrumkanban.application.mappers.LabelMapper;
import com.scrumkanban.domain.model.Label;
import com.scrumkanban.domain.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LabelUseCase {

    private final LabelRepository labelRepository;
    private final LabelMapper labelMapper;

    public LabelDto createLabel(Long projectId, CreateLabelRequest request) {
        Label label = labelMapper.toDomain(request);
        label.setProjectId(projectId);

        Label saved = labelRepository.save(label);
        return labelMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<LabelDto> getLabelsByProject(Long projectId) {
        return labelRepository.findByProjectId(projectId).stream()
                .map(labelMapper::toDto)
                .collect(Collectors.toList());
    }

    public void deleteLabel(Long id) {
        labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label", id));
        labelRepository.deleteById(id);
    }
}
