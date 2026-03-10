package com.scrumkanban.domain.repository;

import com.scrumkanban.domain.model.Label;

import java.util.List;
import java.util.Optional;

public interface LabelRepository {

    Optional<Label> findById(Long id);

    List<Label> findByProjectId(Long projectId);

    Label save(Label label);

    void deleteById(Long id);
}
