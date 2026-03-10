package com.scrumkanban.web.controllers;

import com.scrumkanban.application.dto.CreateSprintRequest;
import com.scrumkanban.application.dto.SprintDto;
import com.scrumkanban.application.usecases.SprintUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/sprints")
@RequiredArgsConstructor
@Tag(name = "Sprints", description = "Sprint management endpoints")
public class SprintController {

    private final SprintUseCase sprintUseCase;

    @GetMapping
    @Operation(summary = "Get sprints by project", description = "Retrieves all sprints for a given project")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved sprints")
    public List<SprintDto> getBySprint(@PathVariable Long projectId) {
        return sprintUseCase.getSprintsByProject(projectId);
    }

    @PostMapping
    @Operation(summary = "Create sprint", description = "Creates a new sprint within the specified project")
    @ApiResponse(responseCode = "201", description = "Sprint successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid sprint data")
    public ResponseEntity<SprintDto> create(@PathVariable Long projectId,
                                            @Valid @RequestBody CreateSprintRequest request) {
        SprintDto sprint = sprintUseCase.createSprint(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(sprint);
    }

    @GetMapping("/{sprintId}")
    @Operation(summary = "Get sprint by ID", description = "Retrieves a specific sprint by its ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved sprint")
    @ApiResponse(responseCode = "404", description = "Sprint not found")
    public SprintDto getById(@PathVariable Long projectId, @PathVariable Long sprintId) {
        return sprintUseCase.getSprintById(sprintId);
    }

    @PutMapping("/{sprintId}/activate")
    @Operation(summary = "Activate sprint", description = "Activates the specified sprint")
    @ApiResponse(responseCode = "200", description = "Sprint successfully activated")
    @ApiResponse(responseCode = "404", description = "Sprint not found")
    public SprintDto activate(@PathVariable Long projectId, @PathVariable Long sprintId) {
        return sprintUseCase.activateSprint(sprintId);
    }

    @PutMapping("/{sprintId}/complete")
    @Operation(summary = "Complete sprint", description = "Marks the specified sprint as complete")
    @ApiResponse(responseCode = "200", description = "Sprint successfully completed")
    @ApiResponse(responseCode = "404", description = "Sprint not found")
    public SprintDto complete(@PathVariable Long projectId, @PathVariable Long sprintId) {
        return sprintUseCase.completeSprint(sprintId);
    }
}
