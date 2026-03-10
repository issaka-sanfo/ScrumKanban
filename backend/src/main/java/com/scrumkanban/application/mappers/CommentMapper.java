package com.scrumkanban.application.mappers;

import com.scrumkanban.application.dto.CommentDto;
import com.scrumkanban.application.dto.CreateCommentRequest;
import com.scrumkanban.domain.model.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "authorName", ignore = true)
    CommentDto toDto(Comment comment);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "taskId", ignore = true)
    @Mapping(target = "authorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Comment toDomain(CreateCommentRequest request);
}
