package com.scrumkanban.application.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SprintDto {

    private Long id;
    private String name;
    private String goal;
    private Long projectId;
    private String startDate;
    private String endDate;
    private String status;
    private LocalDateTime createdAt;
}
