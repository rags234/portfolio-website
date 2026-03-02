package com.rajat.portfolio.service;

import com.rajat.portfolio.dto.ContactRequest;
import com.rajat.portfolio.model.ContactMessage;
import com.rajat.portfolio.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ContactService {

    private final ContactMessageRepository repo;

    public ContactService(ContactMessageRepository repo) {
        this.repo = repo;
    }

    public void save(ContactRequest req) {
        ContactMessage msg = ContactMessage.builder()
                .name(req.name())
                .email(req.email())
                .message(req.message())
                .createdAt(Instant.now())
                .build();

        repo.save(msg);
    }
}
