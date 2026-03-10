package com.scrumkanban.web.controllers;

import com.scrumkanban.application.dto.CreateProjectRequest;
import com.scrumkanban.application.dto.ProjectDto;
import com.scrumkanban.application.dto.UserDto;
import com.scrumkanban.application.usecases.ProjectUseCase;
import com.scrumkanban.web.security.CurrentUser;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project management endpoints")
public class ProjectController {

    private final ProjectUseCase projectUseCase;
    private final CurrentUser currentUser;

    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieves a list of all projects")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all projects")
    public List<ProjectDto> getAll() {
        return projectUseCase.getAllProjects();
    }

    @GetMapping("/my")
    @Operation(summary = "Get user projects", description = "Retrieves projects belonging to the current user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user projects")
    public List<ProjectDto> getUserProjects() {
        return projectUseCase.getUserProjects(currentUser.getUserId());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieves a specific project by its ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved project")
    @ApiResponse(responseCode = "404", description = "Project not found")
    public ProjectDto getById(@PathVariable Long id) {
        return projectUseCase.getProjectById(id);
    }

    @PostMapping
    @Operation(summary = "Create project", description = "Creates a new project for the current user")
    @ApiResponse(responseCode = "201", description = "Project successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid project data")
    public ResponseEntity<ProjectDto> create(@Valid @RequestBody CreateProjectRequest request) {
        ProjectDto project = projectUseCase.createProject(request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @GetMapping("/{id}/members")
    @Operation(summary = "Get project members", description = "Retrieves all members of the specified project")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved project members")
    public List<UserDto> getMembers(@PathVariable Long id) {
        return projectUseCase.getProjectMembers(id);
    }

    @PostMapping("/{id}/members/{userId}")
    @Operation(summary = "Add member to project", description = "Adds a user as a member to the specified project")
    @ApiResponse(responseCode = "200", description = "Member successfully added")
    @ApiResponse(responseCode = "404", description = "Project or user not found")
    public ProjectDto addMember(@PathVariable Long id, @PathVariable Long userId) {
        return projectUseCase.addMember(id, userId);
    }
}
