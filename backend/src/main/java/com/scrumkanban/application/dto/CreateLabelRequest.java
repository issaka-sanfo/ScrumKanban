package com.scrumkanban.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateLabelRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String color;
}
