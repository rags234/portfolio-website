package com.rajat.portfolio.controller;

import com.rajat.portfolio.dto.ContactRequest;
import com.rajat.portfolio.model.ContactMessage;
import com.rajat.portfolio.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor

public class ContactController {

    private final ContactMessageRepository repo;

    @PostMapping
    public Map<String, Object> submit(@Valid @RequestBody ContactRequest req) {
        ContactMessage saved = repo.save(ContactMessage.builder()
                .name(req.name())
                .email(req.email())
                .message(req.message())
                .createdAt(Instant.now())
                .build());

        return Map.of("status", "ok", "id", saved.getId());
    }
}