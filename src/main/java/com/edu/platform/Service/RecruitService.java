package com.edu.platform.Service;

import com.edu.platform.Model.Recruit;
import com.edu.platform.Model.RecruitUser;
import com.edu.platform.Model.User;
import com.edu.platform.Repository.RecruitRepository;
import com.edu.platform.Repository.RecruitUserRepository;
import com.edu.platform.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class RecruitService {

    private final RecruitRepository recruitRepo;
    private final UserRepository userRepo;
    private final RecruitUserRepository ruRepo;

    public RecruitService(RecruitRepository recruitRepo, UserRepository userRepo, RecruitUserRepository ruRepo) {
        this.recruitRepo = recruitRepo;
        this.userRepo = userRepo;
        this.ruRepo = ruRepo;
    }

    @Transactional
    public void apply(Integer rId, String email) {
        Recruit r = recruitRepo.findById(rId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채용입니다."));
        User u = userRepo.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        if (ruRepo.existsByRecruitAndUser(r, u)) {
            throw new IllegalStateException("이미 지원하셨습니다.");
        }
        RecruitUser ru = new RecruitUser();
        ru.setRecruit(r);
        ru.setUser(u);
        ru.setAppliedAt(LocalDateTime.now());
        ruRepo.save(ru);
    }

    @Transactional
    public void deleteRecruit(Integer id) {
        Recruit r = recruitRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("해당 채용이 존재하지 않습니다."));
        ruRepo.deleteAllByRecruit(r);
        recruitRepo.delete(r);
    }
}
