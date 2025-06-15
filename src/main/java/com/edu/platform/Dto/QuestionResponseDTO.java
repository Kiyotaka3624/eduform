package com.edu.platform.Dto;

import com.edu.platform.Model.Question;
import java.time.LocalDateTime;

public class QuestionResponseDTO {
    private Integer qid;
    private String title;
    private String content;
    private String userName;
    private LocalDateTime createdAt;
    private int viewCount;

    public static QuestionResponseDTO fromEntity(Question question) {
        QuestionResponseDTO dto = new QuestionResponseDTO();
        dto.qid = question.getQId();
        dto.title = question.getTitle();
        dto.content = question.getContent();
        dto.userName = question.getUser().getName();
        dto.createdAt = question.getCreatedAt();
        dto.viewCount = question.getViewCount();
        return dto;
    }

    public Integer getQid() {
        return qid;
    }

    public void setQid(Integer qid) {
        this.qid = qid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }
}
