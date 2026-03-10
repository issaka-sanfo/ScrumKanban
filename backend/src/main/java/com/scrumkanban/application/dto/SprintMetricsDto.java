package com.scrumkanban.application.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class SprintMetricsDto {

    private Long sprintId;
    private String sprintName;
    private int totalTasks;
    private int completedTasks;
    private int totalStoryPoints;
    private int completedStoryPoints;
    private Map<String, Integer> tasksByStatus;
}
