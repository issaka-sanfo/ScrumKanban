package com.scrumkanban.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private Integer storyPoints;
    private Long sprintId;
    private Long projectId;
    private Long reporterId;
    @Builder.Default
    private Set<Long> assigneeIds = new HashSet<>();
    @Builder.Default
    private Set<Long> labelIds = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
