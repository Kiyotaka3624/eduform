package com.edu.platform.Service;

import com.edu.platform.Model.Training;
import com.edu.platform.Model.TrainingUser;
import com.edu.platform.Model.User;
import com.edu.platform.Repository.TrainingRepository;
import com.edu.platform.Repository.TrainingUserRepository;
import com.edu.platform.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TrainingService {
    private final TrainingRepository trainingRepo;
    private final UserRepository userRepo;
    private final TrainingUserRepository tuRepo;

    public TrainingService(TrainingRepository trainingRepo,
                           UserRepository userRepo,
                           TrainingUserRepository tuRepo) {
        this.trainingRepo = trainingRepo;
        this.userRepo = userRepo;
        this.tuRepo = tuRepo;
    }

    @Transactional
    public void apply(Integer trainingId, String email) {
        Training t = trainingRepo.findById(trainingId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 훈련입니다."));
        User u = userRepo.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        if (tuRepo.existsByTrainingAndUser(t, u)) {
            throw new IllegalStateException("이미 신청하셨습니다.");
        }
        TrainingUser tu = new TrainingUser();
        tu.setTraining(t);
        tu.setUser(u);
        tu.setJoinedAt(LocalDateTime.now());
        tuRepo.save(tu);
    }

    @Transactional
    public void deleteTraining(Integer id) {
        Training training = trainingRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("해당 훈련이 존재하지 않습니다."));
        tuRepo.deleteAllByTraining(training);  // 연관 신청자 데이터 삭제
        trainingRepo.delete(training);
    }
}