package com.scrumkanban.application.mappers;

import com.scrumkanban.application.dto.CreateProjectRequest;
import com.scrumkanban.application.dto.ProjectDto;
import com.scrumkanban.domain.model.Project;
import com.scrumkanban.domain.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "ownerName", source = "owner.fullName")
    @Mapping(target = "memberIds", source = "members", qualifiedByName = "membersToIds")
    ProjectDto toDto(Project project);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Project toDomain(CreateProjectRequest request);

    @Named("membersToIds")
    default Set<Long> membersToIds(Set<User> members) {
        if (members == null) {
            return Collections.emptySet();
        }
        return members.stream()
                .map(User::getId)
                .collect(Collectors.toSet());
    }
}
