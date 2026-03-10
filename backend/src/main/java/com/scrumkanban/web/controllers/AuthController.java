package com.scrumkanban.web.controllers;

import com.scrumkanban.application.dto.AuthResponse;
import com.scrumkanban.application.dto.LoginRequest;
import com.scrumkanban.application.dto.RegisterRequest;
import com.scrumkanban.application.dto.UserDto;
import com.scrumkanban.application.usecases.AuthUseCase;
import com.scrumkanban.web.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and user registration endpoints")
public class AuthController {

    private final AuthUseCase authUseCase;
    private final CurrentUser currentUser;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Authenticates a user with credentials and returns a token")
    @ApiResponse(responseCode = "200", description = "Successfully authenticated")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authUseCase.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates a new user account and returns a token")
    @ApiResponse(responseCode = "201", description = "User successfully registered")
    @ApiResponse(responseCode = "400", description = "Invalid registration data")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authUseCase.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns the currently authenticated user's information")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved current user")
    @ApiResponse(responseCode = "401", description = "Not authenticated")
    public ResponseEntity<UserDto> getCurrentUser() {
        var user = currentUser.getUser();
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        return ResponseEntity.ok(userDto);
    }
}
