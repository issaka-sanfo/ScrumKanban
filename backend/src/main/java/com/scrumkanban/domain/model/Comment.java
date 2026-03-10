package com.scrumkanban.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    private Long id;
    private String content;
    private Long taskId;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
