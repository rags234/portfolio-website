package com.rajat.portfolio.controller;

import com.rajat.portfolio.security.JwtUtil;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor

public class AuthController {

    private final JwtUtil jwtUtil;

    @Value("${app.admin.username}")
    private String adminUser;

    @Value("${app.admin.password}")
    private String adminPass;

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        if (!adminUser.equals(req.username()) || !adminPass.equals(req.password())) {
            return Map.of("status", "error", "message", "Invalid credentials");
        }
        String token = jwtUtil.generateToken(req.username());
        return Map.of("status", "ok", "token", token);
    }
}