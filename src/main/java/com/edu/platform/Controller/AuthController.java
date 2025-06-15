package com.edu.platform.Controller;

import com.edu.platform.Dto.LoginRequest;
import com.edu.platform.Dto.LoginResponse;
import com.edu.platform.Dto.SignupRequest;
import com.edu.platform.Dto.SignupResponse;
import com.edu.platform.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import com.edu.platform.Exception.AuthenticationException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * 로그인 처리
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            HttpServletRequest request,
            @Valid @RequestBody LoginRequest req,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : bindingResult.getFieldErrors()) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }

        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        try {
            LoginResponse resp = authService.login(req, ipAddress, userAgent);
            return ResponseEntity.ok(resp);
        } catch (AuthenticationException ae) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ae.getMessage()));
        }
    }

    /**
     * 회원가입 처리
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody SignupRequest req,
            BindingResult bindingResult
    ) {
        // DTO 검증 에러
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : bindingResult.getFieldErrors()) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            SignupResponse resp = authService.signup(req);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(resp);
        } catch (IllegalArgumentException iae) {
            // 중복 이메일/폰 검사 등 서비스 레벨 예외
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", iae.getMessage()));
        } catch (Exception e) {
            // 그 외 서버 에러
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "회원가입 처리 중 오류가 발생했습니다"));
        }
    }
}
