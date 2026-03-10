package com.scrumkanban.application.usecases;

import com.scrumkanban.application.dto.CreateSprintRequest;
import com.scrumkanban.application.dto.SprintDto;
import com.scrumkanban.application.mappers.SprintMapper;
import com.scrumkanban.domain.model.Sprint;
import com.scrumkanban.domain.model.SprintStatus;
import com.scrumkanban.domain.repository.ProjectRepository;
import com.scrumkanban.domain.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SprintUseCase {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final SprintMapper sprintMapper;

    public SprintDto createSprint(Long projectId, CreateSprintRequest request) {
        projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));

        Sprint sprint = sprintMapper.toDomain(request);
        sprint.setProjectId(projectId);
        sprint.setStatus(SprintStatus.PLANNING);

        Sprint saved = sprintRepository.save(sprint);
        return sprintMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<SprintDto> getSprintsByProject(Long projectId) {
        return sprintRepository.findByProjectId(projectId).stream()
                .map(sprintMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SprintDto getSprintById(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", id));
        return sprintMapper.toDto(sprint);
    }

    public SprintDto activateSprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", sprintId));

        if (sprint.getStatus() != SprintStatus.PLANNING) {
            throw new IllegalStateException("Only sprints in PLANNING status can be activated");
        }

        sprint.setStatus(SprintStatus.ACTIVE);
        Sprint saved = sprintRepository.save(sprint);
        return sprintMapper.toDto(saved);
    }

    public SprintDto completeSprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", sprintId));

        if (sprint.getStatus() != SprintStatus.ACTIVE) {
            throw new IllegalStateException("Only sprints in ACTIVE status can be completed");
        }

        sprint.setStatus(SprintStatus.COMPLETED);
        Sprint saved = sprintRepository.save(sprint);
        return sprintMapper.toDto(saved);
    }
}
