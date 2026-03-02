package com.rajat.portfolio.repository;

import com.rajat.portfolio.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {}
