package com.lucifer.jobassistant.repository;

import com.lucifer.jobassistant.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume,Long> {
    List<Resume> findByUserId(Long userId);
}
