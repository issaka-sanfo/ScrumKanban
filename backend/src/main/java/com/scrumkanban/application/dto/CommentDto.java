package com.scrumkanban.application.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentDto {

    private Long id;
    private String content;
    private Long taskId;
    private Long authorId;
    private String authorName;
    private LocalDateTime createdAt;
}
