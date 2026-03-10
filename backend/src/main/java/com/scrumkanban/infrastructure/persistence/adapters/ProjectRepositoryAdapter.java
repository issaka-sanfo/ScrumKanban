package com.scrumkanban.infrastructure.persistence.adapters;

import com.scrumkanban.domain.model.Project;
import com.scrumkanban.domain.model.User;
import com.scrumkanban.domain.repository.ProjectRepository;
import com.scrumkanban.infrastructure.persistence.entities.ProjectEntity;
import com.scrumkanban.infrastructure.persistence.entities.UserEntity;
import com.scrumkanban.infrastructure.persistence.repositories.JpaProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ProjectRepositoryAdapter implements ProjectRepository {

    private final JpaProjectRepository jpaProjectRepository;

    @Override
    public Optional<Project> findById(Long id) {
        return jpaProjectRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Project> findAll() {
        return jpaProjectRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Project> findByOwnerId(Long ownerId) {
        return jpaProjectRepository.findByOwnerId(ownerId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Project> findByMemberId(Long memberId) {
        return jpaProjectRepository.findByMemberId(memberId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Project save(Project project) {
        ProjectEntity entity = toEntity(project);
        ProjectEntity saved = jpaProjectRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        jpaProjectRepository.deleteById(id);
    }

    private Project toDomain(ProjectEntity entity) {
        Set<User> members = new HashSet<>();
        if (entity.getMembers() != null) {
            members = entity.getMembers().stream()
                    .map(this::userEntityToDomain)
                    .collect(Collectors.toSet());
        }

        return Project.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .owner(userEntityToDomain(entity.getOwner()))
                .members(members)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private User userEntityToDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .fullName(entity.getFullName())
                .role(entity.getRole())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private ProjectEntity toEntity(Project project) {
        UserEntity ownerEntity = UserEntity.builder()
                .id(project.getOwner().getId())
                .build();

        Set<UserEntity> memberEntities = new HashSet<>();
        if (project.getMembers() != null) {
            memberEntities = project.getMembers().stream()
                    .map(member -> UserEntity.builder().id(member.getId()).build())
                    .collect(Collectors.toSet());
        }

        return ProjectEntity.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .owner(ownerEntity)
                .members(memberEntities)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
