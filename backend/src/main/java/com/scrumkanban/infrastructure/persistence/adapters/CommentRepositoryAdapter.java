package com.scrumkanban.infrastructure.persistence.adapters;

import com.scrumkanban.domain.model.Comment;
import com.scrumkanban.domain.repository.CommentRepository;
import com.scrumkanban.infrastructure.persistence.entities.CommentEntity;
import com.scrumkanban.infrastructure.persistence.entities.TaskEntity;
import com.scrumkanban.infrastructure.persistence.entities.UserEntity;
import com.scrumkanban.infrastructure.persistence.repositories.JpaCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CommentRepositoryAdapter implements CommentRepository {

    private final JpaCommentRepository jpaCommentRepository;

    @Override
    public Optional<Comment> findById(Long id) {
        return jpaCommentRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Comment> findByTaskId(Long taskId) {
        return jpaCommentRepository.findByTaskId(taskId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Comment save(Comment comment) {
        CommentEntity entity = toEntity(comment);
        CommentEntity saved = jpaCommentRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        jpaCommentRepository.deleteById(id);
    }

    private Comment toDomain(CommentEntity entity) {
        return Comment.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .taskId(entity.getTask().getId())
                .authorId(entity.getAuthor().getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private CommentEntity toEntity(Comment comment) {
        TaskEntity taskRef = TaskEntity.builder()
                .id(comment.getTaskId())
                .build();

        UserEntity authorRef = UserEntity.builder()
                .id(comment.getAuthorId())
                .build();

        return CommentEntity.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .task(taskRef)
                .author(authorRef)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
