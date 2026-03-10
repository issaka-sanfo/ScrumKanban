package com.scrumkanban.infrastructure.persistence.repositories;

import com.scrumkanban.infrastructure.persistence.entities.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaCommentRepository extends JpaRepository<CommentEntity, Long> {

    List<CommentEntity> findByTaskId(Long taskId);
}
