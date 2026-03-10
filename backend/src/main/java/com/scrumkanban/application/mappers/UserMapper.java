package com.scrumkanban.application.mappers;

import com.scrumkanban.application.dto.RegisterRequest;
import com.scrumkanban.application.dto.UserDto;
import com.scrumkanban.domain.model.Role;
import com.scrumkanban.domain.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", expression = "java(user.getRole().name())")
    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", expression = "java(com.scrumkanban.domain.model.Role.DEVELOPER)")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toDomain(RegisterRequest request);
}
