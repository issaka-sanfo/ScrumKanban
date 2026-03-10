package com.scrumkanban.domain.service;

import com.scrumkanban.domain.model.TaskStatus;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.Map;
import java.util.Set;

@Service
public class TaskDomainService {

    private static final int MIN_STORY_POINTS = 1;
    private static final int MAX_STORY_POINTS = 100;

    private static final Map<TaskStatus, Set<TaskStatus>> ALLOWED_TRANSITIONS = new EnumMap<>(TaskStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(TaskStatus.BACKLOG, Set.of(TaskStatus.TODO));
        ALLOWED_TRANSITIONS.put(TaskStatus.TODO, Set.of(TaskStatus.IN_PROGRESS, TaskStatus.BACKLOG));
        ALLOWED_TRANSITIONS.put(TaskStatus.IN_PROGRESS, Set.of(TaskStatus.CODE_REVIEW, TaskStatus.TODO));
        ALLOWED_TRANSITIONS.put(TaskStatus.CODE_REVIEW, Set.of(TaskStatus.TESTING, TaskStatus.IN_PROGRESS));
        ALLOWED_TRANSITIONS.put(TaskStatus.TESTING, Set.of(TaskStatus.DONE, TaskStatus.IN_PROGRESS));
        ALLOWED_TRANSITIONS.put(TaskStatus.DONE, Set.of(TaskStatus.TODO));
    }

    public boolean validateStatusTransition(TaskStatus currentStatus, TaskStatus newStatus) {
        if (currentStatus == newStatus) {
            return true;
        }
        Set<TaskStatus> allowed = ALLOWED_TRANSITIONS.get(currentStatus);
        return allowed != null && allowed.contains(newStatus);
    }

    public void validateStoryPoints(Integer storyPoints) {
        if (storyPoints == null) {
            return;
        }
        if (storyPoints < MIN_STORY_POINTS || storyPoints > MAX_STORY_POINTS) {
            throw new IllegalArgumentException(
                    String.format("Story points must be between %d and %d, got %d",
                            MIN_STORY_POINTS, MAX_STORY_POINTS, storyPoints));
        }
    }
}
