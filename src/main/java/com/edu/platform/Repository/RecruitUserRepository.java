package com.edu.platform.Repository;

import com.edu.platform.Model.Recruit;
import com.edu.platform.Model.RecruitUser;
import com.edu.platform.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecruitUserRepository extends JpaRepository<RecruitUser, Integer> {
    boolean existsByRecruitAndUser(Recruit r, User u);
    void deleteAllByRecruit(Recruit r);
}
