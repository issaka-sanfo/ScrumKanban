package com.scrumkanban.infrastructure.persistence.repositories;

import com.scrumkanban.infrastructure.persistence.entities.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JpaProjectRepository extends JpaRepository<ProjectEntity, Long> {

    List<ProjectEntity> findByOwnerId(Long ownerId);

    @Query("SELECT p FROM ProjectEntity p JOIN p.members m WHERE m.id = :memberId")
    List<ProjectEntity> findByMemberId(@Param("memberId") Long memberId);
}
