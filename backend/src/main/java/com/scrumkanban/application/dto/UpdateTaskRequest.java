package com.scrumkanban.application.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UpdateTaskRequest {

    private String title;
    private String description;
    private String priority;
    private Integer storyPoints;
    private Long sprintId;
    private Set<Long> assigneeIds;
    private Set<Long> labelIds;
}
