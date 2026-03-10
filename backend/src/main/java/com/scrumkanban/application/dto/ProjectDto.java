package com.scrumkanban.application.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class ProjectDto {

    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private String ownerName;
    private Set<Long> memberIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
