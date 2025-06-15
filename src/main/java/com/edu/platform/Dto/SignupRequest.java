package com.edu.platform.Dto;

import com.edu.platform.Model.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public class SignupRequest {

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "이메일 형식이 올바르지 않습니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 128, message = "비밀번호는 8자에서 128자 사이여야 합니다")
    private String password;

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    @NotBlank(message = "전화번호는 필수입니다")
    private String phone;

    @NotBlank(message = "주소는 필수입니다")
    private String address;

    @NotNull(message = "역할은 필수입니다")
    private Role role;

    @Valid
    private StudentInfo student;

    @Valid
    private ProfessorInfo professor;

    @Valid
    private AdminInfo admin;

    // === Getters & Setters ===
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public StudentInfo getStudent() { return student; }
    public void setStudent(StudentInfo student) { this.student = student; }

    public ProfessorInfo getProfessor() { return professor; }
    public void setProfessor(ProfessorInfo professor) { this.professor = professor; }

    public AdminInfo getAdmin() { return admin; }
    public void setAdmin(AdminInfo admin) { this.admin = admin; }

    // === 편의용 Getter 추가 (switch-case 사용 위해) ===
    public String getStudentNumber() {
        return student != null ? student.getStudentNumber() : null;
    }
    public String getMajor() {
        return student != null ? student.getMajor() : null;
    }
    public Short getGrade() {
        return student != null ? student.getGrade() : null;
    }

    public String getImageUrl() {
        return professor != null ? professor.getImageUrl() : null;
    }
    public String getDepartment() {
        return professor != null ? professor.getDepartment() : null;
    }

    public String getPosition() {
        return admin != null ? admin.getPosition() : null;
    }
    public Short getAuthorityLevel() {
        return admin != null ? admin.getAuthorityLevel() : null;
    }

    // === Inner Class: StudentInfo ===
    public static class StudentInfo {
        @NotBlank(message = "학번을 입력해주세요")
        private String studentNumber;

        private String major;

        @NotNull(message = "학년을 입력해주세요")
        @Min(value = 1, message = "학년은 1 이상이어야 합니다")
        @Max(value = 6, message = "학년은 6 이하이어야 합니다")
        private Short grade;

        public String getStudentNumber() { return studentNumber; }
        public void setStudentNumber(String studentNumber) { this.studentNumber = studentNumber; }

        public String getMajor() { return major; }
        public void setMajor(String major) { this.major = major; }

        public Short getGrade() { return grade; }
        public void setGrade(Short grade) { this.grade = grade; }
    }

    // === Inner Class: ProfessorInfo ===
    public static class ProfessorInfo {
        @NotBlank(message = "프로필 이미지 URL을 입력해주세요")
        private String imageUrl;

        private String department;

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }

    // === Inner Class: AdminInfo ===
    public static class AdminInfo {
        @NotBlank(message = "직위를 입력해주세요")
        private String position;

        @NotNull(message = "권한 레벨을 입력해주세요")
        @Min(value = 1, message = "권한 레벨은 1 이상이어야 합니다")
        @Max(value = 10, message = "권한 레벨은 10 이하이어야 합니다")
        private Short authorityLevel;

        public String getPosition() { return position; }
        public void setPosition(String position) { this.position = position; }

        public Short getAuthorityLevel() { return authorityLevel; }
        public void setAuthorityLevel(Short authorityLevel) { this.authorityLevel = authorityLevel; }
    }
}
