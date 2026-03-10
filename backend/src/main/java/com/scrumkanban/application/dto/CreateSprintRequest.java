package com.scrumkanban.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSprintRequest {

    @NotBlank
    private String name;

    private String goal;

    @NotBlank
    private String startDate;

    @NotBlank
    private String endDate;
}
