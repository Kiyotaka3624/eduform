package com.edu.platform.Controller;

import com.edu.platform.Repository.LoginLogRepository;
import org.springframework.web.bind.annotation.*;
import com.edu.platform.Dto.LoginLogDto;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final LoginLogRepository loginLogRepo;

    public AdminController(LoginLogRepository loginLogRepo) {
        this.loginLogRepo = loginLogRepo;
    }

    @GetMapping("/login-logs")
    public List<LoginLogDto> getLogs() {
        return loginLogRepo.findAll().stream()
            .map(LoginLogDto::from)
            .toList();
    }
}