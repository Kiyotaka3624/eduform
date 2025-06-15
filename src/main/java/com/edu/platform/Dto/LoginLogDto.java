package com.edu.platform.Dto;

import com.edu.platform.Model.LoginLog;

public record LoginLogDto(
	    int logId,
	    String loginTime,
	    String ipAddress,
	    String userAgent,
	    String userName,
	    String userEmail
	) {
	    public static LoginLogDto from(LoginLog log) {
	        return new LoginLogDto(
	            log.getLogId(),
	            log.getLoginTime().toString(),
	            log.getIpAddress(),
	            log.getUserAgent(),
	            log.getUser().getName(),
	            log.getUser().getEmail()
	        );
	    }
	}