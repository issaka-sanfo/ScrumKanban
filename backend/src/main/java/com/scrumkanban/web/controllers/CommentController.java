package com.scrumkanban.web.controllers;

import com.scrumkanban.application.dto.CommentDto;
import com.scrumkanban.application.dto.CreateCommentRequest;
import com.scrumkanban.application.usecases.CommentUseCase;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tasks/{taskId}/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Task comment management endpoints")
public class CommentController {

    private final CommentUseCase commentUseCase;
    private final CurrentUser currentUser;

    @GetMapping
    @Operation(summary = "Get comments by task", description = "Retrieves all comments for a given task")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved comments")
    public List<CommentDto> getByTask(@PathVariable Long taskId) {
        return commentUseCase.getCommentsByTask(taskId);
    }

    @PostMapping
    @Operation(summary = "Create comment", description = "Adds a new comment to the specified task")
    @ApiResponse(responseCode = "201", description = "Comment successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid comment data")
    public ResponseEntity<CommentDto> create(@PathVariable Long taskId,
                                             @Valid @RequestBody CreateCommentRequest request) {
        CommentDto comment = commentUseCase.addComment(taskId, request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @DeleteMapping("/{commentId}")
    @Operation(summary = "Delete comment", description = "Deletes a comment by its ID")
    @ApiResponse(responseCode = "204", description = "Comment successfully deleted")
    @ApiResponse(responseCode = "404", description = "Comment not found")
    public ResponseEntity<Void> delete(@PathVariable Long taskId, @PathVariable Long commentId) {
        commentUseCase.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
