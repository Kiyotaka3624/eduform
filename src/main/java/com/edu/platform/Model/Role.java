package com.edu.platform.Model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    STUDENT, PROFESSOR, ADMIN;

    @JsonCreator
    public static Role from(String value) {
        return Role.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
    
    public static Role fromString(String role) {
        return Role.valueOf(role.toUpperCase());
    }
    
}