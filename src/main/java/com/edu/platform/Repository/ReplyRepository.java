package com.edu.platform.Repository;

import com.edu.platform.Model.Reply;
import com.edu.platform.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {
    List<Reply> findByQuestion_qId(Integer qId); // ✅ 정확한 변수명 사용
    // 또는 ↓ 이 방식이 더 권장됨
    // List<Reply> findByQuestion(Question question);
}
