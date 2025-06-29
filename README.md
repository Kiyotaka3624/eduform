# EduForm Web Site

## DB Setting
MariaDB Docker Install
```bash
docker pull mariadb
docker run --name edu_platform -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d

ocker exec -it edu_platform /bin/bash
mariadb -u root -p
( Password : 1234 입력 )
```

Create DB User
```sql
-- Create User
CREATE USER 'edu_platform'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON *.* TO 'edu_platform'@'%';
FLUSH PRIVILEGES;
```

Connect edu_platformm DB User
```bash
mariadb -u edu_platform -p
( Password : 1234 입력 )
```

Crreate Database & Tables
```sql
-- Create Database
CREATE DATABASE edu_platform_db;

-- users 테이블
CREATE TABLE `users` (
  `u_id` INT AUTO_INCREMENT PRIMARY KEY,
  `pw` VARCHAR(255) NOT NULL COMMENT '비밀번호는 반드시 해시하여 저장할 것',
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `phone` VARCHAR(13) NOT NULL UNIQUE,
  `address` VARCHAR(100) NOT NULL,
  `role` ENUM('student','professor','admin') NOT NULL,
  `is_deleted` BOOL NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- professors 테이블
CREATE TABLE `professors` (
  `p_id` INT AUTO_INCREMENT PRIMARY KEY,
  `u_id` INT NOT NULL UNIQUE,
  `image_url` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`u_id`) REFERENCES `users`(`u_id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- students 테이블
CREATE TABLE `students` (
  `s_id` INT AUTO_INCREMENT PRIMARY KEY,
  `u_id` INT NOT NULL UNIQUE,
  `student_number` VARCHAR(20) NOT NULL UNIQUE,
  `major` VARCHAR(100),
  `grade` TINYINT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`u_id`) REFERENCES `users`(`u_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  -- MariaDB는 CHECK를 파싱만 하므로, 애플리케이션 레벨에서 검증 권장
  CHECK (`grade` BETWEEN 1 AND 6)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- admins 테이블
CREATE TABLE `admins` (
  `a_id` INT AUTO_INCREMENT PRIMARY KEY,
  `u_id` INT NOT NULL UNIQUE,
  `position` VARCHAR(100),
  `authority_level` TINYINT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`u_id`) REFERENCES `users`(`u_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CHECK (`authority_level` BETWEEN 1 AND 10)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- trainings 테이블
CREATE TABLE `trainings` (
  `t_id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `image_url` VARCHAR(255),
  `is_deleted` BOOL NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- recruits 테이블
CREATE TABLE `recruits` (
  `r_id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `image_url` VARCHAR(255),
  `is_deleted` BOOL NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- questions 테이블
CREATE TABLE `questions` (
  `q_id` INT AUTO_INCREMENT PRIMARY KEY,
  `u_id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `image_url` VARCHAR(255),
  `is_deleted` BOOL NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`u_id`) REFERENCES `users`(`u_id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- replies 테이블
CREATE TABLE `replies` (
  `reply_id` INT AUTO_INCREMENT PRIMARY KEY,
  `q_id` INT NOT NULL,
  `u_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `is_deleted` BOOL NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`q_id`) REFERENCES `questions`(`q_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`u_id`) REFERENCES `users`(`u_id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- training_users 테이블
CREATE TABLE `training_users` (
  `t_u_id` INT AUTO_INCREMENT PRIMARY KEY,
  `t_id` INT NOT NULL,
  `u_id` INT NOT NULL,
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`t_id`) REFERENCES `trainings`(`t_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`u_id`) REFERENCES `users`(`u_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY `uq_training_user` (`t_id`,`u_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- recruit_users 테이블
CREATE TABLE `recruit_users` (
  `r_u_id` INT AUTO_INCREMENT PRIMARY KEY,
  `r_id` INT NOT NULL,
  `u_id` INT NOT NULL,
  `applied_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`r_id`) REFERENCES `recruits`(`r_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`u_id`) REFERENCES `users`(`u_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY `uq_recruit_user` (`r_id`,`u_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- login_logs 테이블
CREATE TABLE `login_logs` (
  `log_id` INT AUTO_INCREMENT PRIMARY KEY,
  `u_id` INT NOT NULL,
  `login_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  FOREIGN KEY (`u_id`) REFERENCES `users`(`u_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
```

## Eclipse Setting
Eclipse -> Marketplace Store -> Spring Boot 검색 후 첫번쨰 플러그인 설치

프로젝트 연 후 Server Run
<img width="404" alt="스크린샷 2025-06-15 오후 5 30 20" src="https://github.com/user-attachments/assets/03facb66-5856-451b-9a67-50ba1c25cf3e" />

이 창이 보이지 않으면 상단 바에서 찾아서 열 수 있음
<img width="1141" alt="스크린샷 2025-06-15 오후 5 30 53" src="https://github.com/user-attachments/assets/64b84650-d293-4072-9350-f3360f6f6cbb" />

## React Setting
```bash
cd src/main/edu_platform_frontend
npm i
npm run dev
```
<img width="2056" alt="스크린샷 2025-06-15 오후 4 11 15" src="https://github.com/user-attachments/assets/fd392e55-6eb8-4d79-955a-612f633a5918" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 13 19" src="https://github.com/user-attachments/assets/4e2f48b7-814c-4c00-93c2-4d82ff5874ed" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 13 24" src="https://github.com/user-attachments/assets/2107f178-e173-4b05-af9e-95f61cbf5437" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 16 15" src="https://github.com/user-attachments/assets/8a86c5f8-86ac-423c-a0cb-a9a2269f0f07" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 16 18" src="https://github.com/user-attachments/assets/93a6209f-c17e-442e-9ede-1f66c82892b8" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 17 01" src="https://github.com/user-attachments/assets/1a0c8fc3-2028-41a5-886b-06fac528a71e" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 17 05" src="https://github.com/user-attachments/assets/7b1ac9e6-f985-4581-8cfe-bcd22aa3699a" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 18 43" src="https://github.com/user-attachments/assets/fa6788a6-7234-446e-b77f-56462408d3f9" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 18 46" src="https://github.com/user-attachments/assets/18327080-6076-44d5-a45e-c835ec7fd003" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 18 52" src="https://github.com/user-attachments/assets/a875d871-5d2f-42a8-9771-bd20e0e851e1" />
<img width="2056" alt="스크린샷 2025-06-15 오후 4 19 00" src="https://github.com/user-attachments/assets/724c10c3-8a95-4185-8e1b-370f4c70b6e5" />





