package com.edu.platform.Controller;

import com.edu.platform.Model.Training;
import com.edu.platform.Repository.TrainingRepository;
import com.edu.platform.Service.TrainingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainings")
@CrossOrigin(origins = "*")
public class TrainingController {

    private final TrainingRepository repo;
    private final TrainingService trainingService;

    public TrainingController(TrainingRepository repo, TrainingService trainingService) {
        this.repo = repo;
        this.trainingService = trainingService;
    }

    @GetMapping
    public List<Training> listAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Training> getById(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Training> create(@RequestBody Training t) {
        Training saved = repo.save(t);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            trainingService.deleteTraining(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("삭제 실패: " + e.getMessage());
        }
    }
}