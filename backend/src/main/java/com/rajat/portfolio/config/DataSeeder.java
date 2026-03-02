package com.rajat.portfolio.config;

import com.rajat.portfolio.model.Project;
import com.rajat.portfolio.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(ProjectRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(Project.builder()
                        .name("Portfolio Backend API")
                        .description("Spring Boot API for projects & contact messages.")
                        .tech("Spring Boot, MySQL, JPA")
                        .githubUrl("https://github.com/rags234")
                        .liveUrl(null)
                        .build());
            }
        };
    }
}
