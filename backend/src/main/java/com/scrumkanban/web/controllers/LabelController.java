package com.scrumkanban.web.controllers;

import com.scrumkanban.application.dto.CreateLabelRequest;
import com.scrumkanban.application.dto.LabelDto;
import com.scrumkanban.application.usecases.LabelUseCase;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/labels")
@RequiredArgsConstructor
@Tag(name = "Labels", description = "Project label management endpoints")
public class LabelController {

    private final LabelUseCase labelUseCase;

    @GetMapping
    @Operation(summary = "Get labels by project", description = "Retrieves all labels for a given project")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved labels")
    public List<LabelDto> getByProject(@PathVariable Long projectId) {
        return labelUseCase.getLabelsByProject(projectId);
    }

    @PostMapping
    @Operation(summary = "Create label", description = "Creates a new label within the specified project")
    @ApiResponse(responseCode = "201", description = "Label successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid label data")
    public ResponseEntity<LabelDto> create(@PathVariable Long projectId,
                                           @Valid @RequestBody CreateLabelRequest request) {
        LabelDto label = labelUseCase.createLabel(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(label);
    }

    @DeleteMapping("/{labelId}")
    @Operation(summary = "Delete label", description = "Deletes a label by its ID")
    @ApiResponse(responseCode = "204", description = "Label successfully deleted")
    @ApiResponse(responseCode = "404", description = "Label not found")
    public ResponseEntity<Void> delete(@PathVariable Long projectId, @PathVariable Long labelId) {
        labelUseCase.deleteLabel(labelId);
        return ResponseEntity.noContent().build();
    }
}
