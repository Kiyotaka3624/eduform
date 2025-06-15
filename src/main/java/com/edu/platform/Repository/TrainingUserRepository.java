package com.edu.platform.Repository;

import com.edu.platform.Model.Training;
import com.edu.platform.Model.TrainingUser;
import com.edu.platform.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingUserRepository extends JpaRepository<TrainingUser, Integer> {
    boolean existsByTrainingAndUser(Training training, User user);
    void deleteAllByTraining(Training training);
}
