package com.scrumkanban.web.controllers;

import com.scrumkanban.application.dto.CreateTaskRequest;
import com.scrumkanban.application.dto.TaskDto;
import com.scrumkanban.application.dto.UpdateTaskRequest;
import com.scrumkanban.application.dto.UpdateTaskStatusRequest;
import com.scrumkanban.application.usecases.TaskUseCase;
import com.scrumkanban.web.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management endpoints")
public class TaskController {

    private final TaskUseCase taskUseCase;
    private final CurrentUser currentUser;

    @PostMapping
    @Operation(summary = "Create task", description = "Creates a new task with the current user as reporter")
    @ApiResponse(responseCode = "201", description = "Task successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid task data")
    public ResponseEntity<TaskDto> create(@Valid @RequestBody CreateTaskRequest request) {
        TaskDto task = taskUseCase.createTask(request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Retrieves a specific task by its ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved task")
    @ApiResponse(responseCode = "404", description = "Task not found")
    public TaskDto getById(@PathVariable Long id) {
        return taskUseCase.getTaskById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Updates an existing task")
    @ApiResponse(responseCode = "200", description = "Task successfully updated")
    @ApiResponse(responseCode = "404", description = "Task not found")
    @ApiResponse(responseCode = "400", description = "Invalid task data")
    public TaskDto update(@PathVariable Long id, @Valid @RequestBody UpdateTaskRequest request) {
        return taskUseCase.updateTask(id, request);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update task status", description = "Updates the status of an existing task")
    @ApiResponse(responseCode = "200", description = "Task status successfully updated")
    @ApiResponse(responseCode = "404", description = "Task not found")
    @ApiResponse(responseCode = "400", description = "Invalid status data")
    public TaskDto updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateTaskStatusRequest request) {
        return taskUseCase.updateTaskStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task", description = "Deletes a task by its ID")
    @ApiResponse(responseCode = "204", description = "Task successfully deleted")
    @ApiResponse(responseCode = "404", description = "Task not found")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskUseCase.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sprint/{sprintId}")
    @Operation(summary = "Get tasks by sprint", description = "Retrieves all tasks for a given sprint")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks")
    public List<TaskDto> getBySprint(@PathVariable Long sprintId) {
        return taskUseCase.getTasksBySprint(sprintId);
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get tasks by project", description = "Retrieves all tasks for a given project")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks")
    public List<TaskDto> getByProject(@PathVariable Long projectId) {
        return taskUseCase.getTasksByProject(projectId);
    }

    @GetMapping("/my")
    @Operation(summary = "Get my tasks", description = "Retrieves all tasks assigned to the current user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks")
    public List<TaskDto> getMyTasks() {
        return taskUseCase.getMyTasks(currentUser.getUserId());
    }
}
