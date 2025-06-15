package com.edu.platform.Dto;

public class SignupResponse {
    private String message;

    public SignupResponse() {}

    public SignupResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
