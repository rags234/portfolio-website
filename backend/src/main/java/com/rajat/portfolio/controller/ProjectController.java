package com.rajat.portfolio.controller;

import com.rajat.portfolio.model.Project;
import com.rajat.portfolio.repository.ProjectRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor

public class ProjectController {

    private final ProjectRepository repo;

    @GetMapping
    public List<Project> getAll() {
        return repo.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project create(@Valid @RequestBody Project project) {
        project.setId(null); // ensure new record
        return repo.save(project);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @Valid @RequestBody Project updated) {
        Project existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));

        existing.setName(updated.getName());
        existing.setTech(updated.getTech());
        existing.setDescription(updated.getDescription());
        existing.setGithubUrl(updated.getGithubUrl());
        existing.setLiveUrl(updated.getLiveUrl());

        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
