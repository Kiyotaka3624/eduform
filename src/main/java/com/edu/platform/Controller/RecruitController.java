package com.edu.platform.Controller;

import com.edu.platform.Model.Recruit;
import com.edu.platform.Service.RecruitService;
import com.edu.platform.Repository.RecruitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/recruits")
@CrossOrigin(origins = "*")
public class RecruitController {

    private final RecruitRepository recruitRepo;
    private final RecruitService recruitService;

    public RecruitController(RecruitRepository recruitRepo, RecruitService recruitService) {
        this.recruitRepo = recruitRepo;
        this.recruitService = recruitService;
    }

    // 전체 목록 조회
    @GetMapping
    public List<Recruit> listAll() {
        return recruitRepo.findAll();
    }

    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Recruit> getById(@PathVariable Integer id) {
        return recruitRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 공고 생성
    @PostMapping
    public ResponseEntity<Recruit> create(@RequestBody Recruit r) {
        r.setCreatedAt(LocalDateTime.now());
        r.setUpdatedAt(LocalDateTime.now());
        if (r.getViewCount() == null) r.setViewCount(0);
        if (r.getIsDeleted() == null) r.setIsDeleted(false);

        Recruit saved = recruitRepo.save(r);
        return ResponseEntity.ok(saved);
    }

    // 공고 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            recruitService.deleteRecruit(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("삭제 실패: " + e.getMessage());
        }
    }

    // 공고 지원
    @PostMapping("/{id}/apply")
    public ResponseEntity<?> apply(@PathVariable Integer id, @RequestParam String email) {
        try {
            recruitService.apply(id, email);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("신청 실패: " + e.getMessage());
        }
    }
}
