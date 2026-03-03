package com.rajat.portfolio.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/")
    public String root() {
        return "OK - backend running ✅";
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong ✅";
    }
}