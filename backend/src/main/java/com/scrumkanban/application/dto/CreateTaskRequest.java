package com.scrumkanban.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class CreateTaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String priority;

    private Integer storyPoints;

    private Long sprintId;

    @NotNull
    private Long projectId;

    private Set<Long> assigneeIds;

    private Set<Long> labelIds;
}
