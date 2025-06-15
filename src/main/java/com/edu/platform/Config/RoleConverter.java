package com.edu.platform.Config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.edu.platform.Model.Role;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {

    // 엔티티 → DB: 소문자 저장
    @Override
    public String convertToDatabaseColumn(Role role) {
        return role == null ? null : role.name().toLowerCase();
    }

    // DB → 엔티티: 대문자로 변환해 Enum.valueOf 호출
    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return Role.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("알 수 없는 역할 값: " + dbData, ex);
        }
    }
}