package com.scrumkanban.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sprint {

    private Long id;
    private String name;
    private String goal;
    private Long projectId;
    private LocalDate startDate;
    private LocalDate endDate;
    private SprintStatus status;
    private LocalDateTime createdAt;
}
