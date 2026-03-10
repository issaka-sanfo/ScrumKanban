package com.scrumkanban.domain.repository;

import com.scrumkanban.domain.model.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentRepository {

    Optional<Comment> findById(Long id);

    List<Comment> findByTaskId(Long taskId);

    Comment save(Comment comment);

    void deleteById(Long id);
}
