package com.scrumkanban.application.mappers;

import com.scrumkanban.application.dto.CreateLabelRequest;
import com.scrumkanban.application.dto.LabelDto;
import com.scrumkanban.domain.model.Label;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LabelMapper {

    LabelDto toDto(Label label);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projectId", ignore = true)
    Label toDomain(CreateLabelRequest request);
}
