package com.scrumkanban.application.mappers;

import com.scrumkanban.application.dto.TaskDto;
import com.scrumkanban.domain.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "status", expression = "java(task.getStatus().name())")
    @Mapping(target = "priority", expression = "java(task.getPriority().name())")
    @Mapping(target = "reporterName", ignore = true)
    @Mapping(target = "assignees", ignore = true)
    @Mapping(target = "labels", ignore = true)
    @Mapping(target = "commentCount", ignore = true)
    TaskDto toDto(Task task);
}
