package com.scrumkanban.application.usecases;

import com.scrumkanban.application.dto.CreateProjectRequest;
import com.scrumkanban.application.dto.ProjectDto;
import com.scrumkanban.application.dto.UserDto;
import com.scrumkanban.application.mappers.ProjectMapper;
import com.scrumkanban.application.mappers.UserMapper;
import com.scrumkanban.domain.model.Project;
import com.scrumkanban.domain.model.User;
import com.scrumkanban.domain.repository.ProjectRepository;
import com.scrumkanban.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectUseCase {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;
    private final UserMapper userMapper;

    public ProjectDto createProject(CreateProjectRequest request, Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Project project = projectMapper.toDomain(request);
        project.setOwner(owner);
        project.setMembers(new HashSet<>(Set.of(owner)));

        Project saved = projectRepository.save(project);
        return projectMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        return projectMapper.toDto(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getUserProjects(Long userId) {
        Set<Project> projects = new HashSet<>();
        projects.addAll(projectRepository.findByOwnerId(userId));
        projects.addAll(projectRepository.findByMemberId(userId));

        return projects.stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
        return project.getMembers().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProjectDto addMember(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        project.getMembers().add(user);
        Project saved = projectRepository.save(project);
        return projectMapper.toDto(saved);
    }
}
