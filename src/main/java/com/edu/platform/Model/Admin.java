package com.edu.platform.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "a_id")
    private Integer aId;

    @OneToOne
    @JoinColumn(name = "u_id", nullable = false)
    private User user;

    @Column(length = 100)
    private String position;

    @Column(name = "authority_level", nullable = false)
    private Short authorityLevel;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 기본 생성자 (JPA 스펙)
    public Admin() {}

    // 전체 생성자(필요시)
    public Admin(User user, String position, Short authorityLevel, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.user = user;
        this.position = position;
        this.authorityLevel = authorityLevel;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // --- Getters & Setters ---

    public Integer getAId() {
        return aId;
    }

    public void setAId(Integer aId) {
        this.aId = aId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Short getAuthorityLevel() {
        return authorityLevel;
    }

    public void setAuthorityLevel(Short authorityLevel) {
        this.authorityLevel = authorityLevel;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
