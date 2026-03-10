package com.scrumkanban.application.usecases;

import com.scrumkanban.application.dto.CommentDto;
import com.scrumkanban.application.dto.CreateCommentRequest;
import com.scrumkanban.application.mappers.CommentMapper;
import com.scrumkanban.domain.model.Comment;
import com.scrumkanban.domain.model.User;
import com.scrumkanban.domain.repository.CommentRepository;
import com.scrumkanban.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentUseCase {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    public CommentDto addComment(Long taskId, CreateCommentRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", authorId));

        Comment comment = commentMapper.toDomain(request);
        comment.setTaskId(taskId);
        comment.setAuthorId(authorId);

        Comment saved = commentRepository.save(comment);

        CommentDto dto = commentMapper.toDto(saved);
        dto.setAuthorName(author.getFullName());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByTask(Long taskId) {
        List<Comment> comments = commentRepository.findByTaskId(taskId);

        Set<Long> authorIds = comments.stream()
                .map(Comment::getAuthorId)
                .collect(Collectors.toSet());

        Map<Long, User> usersById = authorIds.stream()
                .map(userRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return comments.stream()
                .map(comment -> {
                    CommentDto dto = commentMapper.toDto(comment);
                    User author = usersById.get(comment.getAuthorId());
                    if (author != null) {
                        dto.setAuthorName(author.getFullName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void deleteComment(Long id) {
        commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        commentRepository.deleteById(id);
    }
}
