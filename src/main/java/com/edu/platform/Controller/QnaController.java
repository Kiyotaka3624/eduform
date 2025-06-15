package com.edu.platform.Controller;

import com.edu.platform.Dto.QuestionResponseDTO;
import com.edu.platform.Dto.ReplyResponseDTO;
import com.edu.platform.Model.Question;
import com.edu.platform.Model.Reply;
import com.edu.platform.Model.User;
import com.edu.platform.Repository.QuestionRepository;
import com.edu.platform.Repository.ReplyRepository;
import com.edu.platform.Repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/qna")
public class QnaController {

    private final QuestionRepository questionRepository;
    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;

    public QnaController(QuestionRepository questionRepository, ReplyRepository replyRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.replyRepository = replyRepository;
        this.userRepository = userRepository;
    }

    // 전체 질문 리스트
    @GetMapping("/questions")
    public List<QuestionResponseDTO> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(QuestionResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 질문 상세
    @GetMapping("/question/{id}")
    public QuestionResponseDTO getQuestion(@PathVariable Integer id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return QuestionResponseDTO.fromEntity(question);
    }

    // 특정 질문에 달린 댓글들
    @GetMapping("/question/{id}/replies")
    public List<ReplyResponseDTO> getReplies(@PathVariable Integer id) {
        return replyRepository.findByQuestionQId(id).stream()
                .map(ReplyResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 댓글 등록
    @PostMapping("/reply")
    public ReplyResponseDTO addReply(@RequestBody ReplyRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Reply reply = new Reply();
        reply.setContent(request.content());
        reply.setQuestion(question);
        reply.setUser(user);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setUpdatedAt(LocalDateTime.now());
        reply.setIsDeleted(false);

        return ReplyResponseDTO.fromEntity(replyRepository.save(reply));
    }

    public record ReplyRequest(Integer userId, Integer questionId, String content) {}
}
