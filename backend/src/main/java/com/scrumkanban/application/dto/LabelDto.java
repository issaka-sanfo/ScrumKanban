package com.scrumkanban.application.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LabelDto {

    private Long id;
    private String name;
    private String color;
    private Long projectId;
}
