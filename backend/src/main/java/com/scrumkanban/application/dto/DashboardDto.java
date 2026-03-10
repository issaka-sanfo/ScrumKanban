package com.scrumkanban.application.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardDto {

    private int totalProjects;
    private int activeSprintsCount;
    private int myTasksCount;
    private List<SprintMetricsDto> sprintMetrics;
}
