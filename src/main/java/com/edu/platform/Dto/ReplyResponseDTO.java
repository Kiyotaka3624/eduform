package com.edu.platform.Dto;

import com.edu.platform.Model.Reply;

import java.time.LocalDateTime;

public class ReplyResponseDTO {
    private Integer replyId;
    private String content;
    private String userName;
    private LocalDateTime createdAt;

    public static ReplyResponseDTO fromEntity(Reply reply) {
        ReplyResponseDTO dto = new ReplyResponseDTO();
        dto.replyId = reply.getReplyId();
        dto.content = reply.getContent();
        dto.userName = reply.getUser() != null ? reply.getUser().getName() : "알 수 없음";
        dto.createdAt = reply.getCreatedAt();
        return dto;
    }

    // getters & setters
    public Integer getReplyId() { return replyId; }
    public void setReplyId(Integer replyId) { this.replyId = replyId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
