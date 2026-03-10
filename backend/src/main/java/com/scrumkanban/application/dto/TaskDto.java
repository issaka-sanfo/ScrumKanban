package com.scrumkanban.application.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TaskDto {

    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private Integer storyPoints;
    private Long sprintId;
    private Long projectId;
    private Long reporterId;
    private String reporterName;
    private List<UserDto> assignees;
    private List<LabelDto> labels;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
