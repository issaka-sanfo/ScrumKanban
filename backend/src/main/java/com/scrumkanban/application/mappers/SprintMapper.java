package com.scrumkanban.application.mappers;

import com.scrumkanban.application.dto.CreateSprintRequest;
import com.scrumkanban.application.dto.SprintDto;
import com.scrumkanban.domain.model.Sprint;
import com.scrumkanban.domain.model.SprintStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDate;

@Mapper(componentModel = "spring")
public interface SprintMapper {

    @Mapping(target = "status", expression = "java(sprint.getStatus().name())")
    @Mapping(target = "startDate", expression = "java(sprint.getStartDate() != null ? sprint.getStartDate().toString() : null)")
    @Mapping(target = "endDate", expression = "java(sprint.getEndDate() != null ? sprint.getEndDate().toString() : null)")
    SprintDto toDto(Sprint sprint);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projectId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "startDate", expression = "java(java.time.LocalDate.parse(request.getStartDate()))")
    @Mapping(target = "endDate", expression = "java(java.time.LocalDate.parse(request.getEndDate()))")
    Sprint toDomain(CreateSprintRequest request);
}
