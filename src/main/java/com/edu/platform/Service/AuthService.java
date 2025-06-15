package com.edu.platform.Service;

import com.edu.platform.Dto.LoginRequest;
import com.edu.platform.Dto.LoginResponse;
import com.edu.platform.Dto.SignupRequest;
import com.edu.platform.Dto.SignupResponse;
import com.edu.platform.Exception.AuthenticationException;
import com.edu.platform.Model.*;
import com.edu.platform.Repository.*;
import com.edu.platform.Util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepo;
    private final StudentRepository studentRepo;
    private final ProfessorRepository professorRepo;
    private final AdminRepository adminRepo;
    private final LoginLogRepository loginLogRepo;
    private final PasswordEncoder pwEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo,
                       StudentRepository studentRepo,
                       ProfessorRepository professorRepo,
                       AdminRepository adminRepo,
                       LoginLogRepository loginLogRepo,
                       PasswordEncoder pwEncoder,
                       JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.studentRepo = studentRepo;
        this.professorRepo = professorRepo;
        this.adminRepo = adminRepo;
        this.loginLogRepo = loginLogRepo;
        this.pwEncoder = pwEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest req, String ipAddress, String userAgent) {
        User user = userRepo.findByEmail(req.getEmail()).orElse(null);
        if (user == null || !pwEncoder.matches(req.getPassword(), user.getPw())) {
            throw new AuthenticationException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 로그인 성공 시 로그인 로그 기록
        LoginLog log = new LoginLog();
        log.setUser(user);
        log.setLoginTime(LocalDateTime.now());
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        loginLogRepo.save(log);

        String token = jwtUtil.generateToken(
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
        return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }

    @Transactional
    public SignupResponse signup(SignupRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다");
        }
        if (userRepo.existsByPhone(req.getPhone())) {
            throw new IllegalArgumentException("이미 사용 중인 전화번호입니다");
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPw(pwEncoder.encode(req.getPassword()));
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setAddress(req.getAddress());
        user.setRole(req.getRole());
        user.setIsDeleted(false);

        User savedUser = userRepo.save(user);
        switch (user.getRole()) {
            case STUDENT -> {
                Student s = new Student();
                s.setUser(savedUser);
                s.setStudentNumber(req.getStudentNumber());
                s.setMajor(req.getMajor());
                s.setGrade(req.getGrade());
                s.setCreatedAt(LocalDateTime.now());
                s.setUpdatedAt(LocalDateTime.now());
                studentRepo.save(s);
            }
            case PROFESSOR -> {
                Professor p = new Professor();
                p.setUser(savedUser);
                p.setImageUrl(req.getImageUrl());
                p.setDepartment(req.getDepartment());
                p.setCreatedAt(LocalDateTime.now());
                p.setUpdatedAt(LocalDateTime.now());
                professorRepo.save(p);
            }
            case ADMIN -> {
                Admin a = new Admin();
                a.setUser(savedUser);
                a.setPosition(req.getPosition());
                a.setAuthorityLevel(req.getAuthorityLevel());
                a.setCreatedAt(LocalDateTime.now());
                a.setUpdatedAt(LocalDateTime.now());
                adminRepo.save(a);
            }
        }
        return new SignupResponse("회원가입이 완료되었습니다");
    }
}