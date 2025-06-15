package com.edu.platform.Repository;

import com.edu.platform.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    // 필요한 커스텀 쿼리 있으면 여기에 추가
}