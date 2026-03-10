package com.scrumkanban.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    private Long id;
    private String name;
    private String description;
    private User owner;
    @Builder.Default
    private Set<User> members = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
