package com.edu.platform.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recruit_users", uniqueConstraints = @UniqueConstraint(columnNames = {"r_id","u_id"}))
public class RecruitUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "r_u_id")
    private Integer rUId;

    @ManyToOne
    @JoinColumn(name = "r_id", nullable = false)
    private Recruit recruit;

    @ManyToOne
    @JoinColumn(name = "u_id", nullable = false)
    private User user;

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    // Getter & Setter

    public Integer getRUId() {
        return rUId;
    }

    public void setRUId(Integer rUId) {
        this.rUId = rUId;
    }

    public Recruit getRecruit() {
        return recruit;
    }

    public void setRecruit(Recruit recruit) {
        this.recruit = recruit;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}
