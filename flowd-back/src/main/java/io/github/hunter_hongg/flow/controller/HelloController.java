package io.github.hunter_hongg.flow.controller;

import io.github.hunter_hongg.flow.json.Status;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/status")
    public Status getStatus() {
        return new Status("OK");
    }

}