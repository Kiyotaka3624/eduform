package com.edu.platform.Dto;

import java.util.Map;

public class ErrorResponse {
    private String error;
    private Object details;

    public ErrorResponse(String error, Object details) {
        this.error   = error;
        this.details = details;
    }

    public String getError() { return error; }
    public Object getDetails() { return details; }
}
