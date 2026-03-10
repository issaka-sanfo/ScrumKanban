package com.scrumkanban.web.controllers;

import com.scrumkanban.application.dto.DashboardDto;
import com.scrumkanban.application.dto.SprintMetricsDto;
import com.scrumkanban.application.usecases.DashboardUseCase;
import com.scrumkanban.web.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard and metrics endpoints")
public class DashboardController {

    private final DashboardUseCase dashboardUseCase;
    private final CurrentUser currentUser;

    @GetMapping
    @Operation(summary = "Get dashboard", description = "Retrieves the dashboard summary for the current user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved dashboard")
    public DashboardDto getDashboard() {
        return dashboardUseCase.getDashboard(currentUser.getUserId());
    }

    @GetMapping("/sprint/{sprintId}/metrics")
    @Operation(summary = "Get sprint metrics", description = "Retrieves metrics for a specific sprint")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved sprint metrics")
    @ApiResponse(responseCode = "404", description = "Sprint not found")
    public SprintMetricsDto getSprintMetrics(@PathVariable Long sprintId) {
        return dashboardUseCase.getSprintMetrics(sprintId);
    }
}
