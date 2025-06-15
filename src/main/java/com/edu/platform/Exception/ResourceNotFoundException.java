package com.edu.platform.Exception;

/**
 * 요청한 리소스가 존재하지 않을 때 발생시키는 예외입니다.
 */
public class ResourceNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
