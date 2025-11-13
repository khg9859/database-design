CREATE TABLE `Member` (
  `member_id` INT PRIMARY KEY AUTO_INCREMENT,
  `student_no` CHAR(8) UNIQUE NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  `contact` CHAR(13) UNIQUE NOT NULL,
  `department` VARCHAR(50) NOT NULL,
  `grade` INT CHECK (grade BETWEEN 1 AND 4),
  `status` ENUM(재학,휴학,졸업) NOT NULL DEFAULT '재학',
  `role_type` ENUM(GENERAL,MENTOR,MENTEE) NOT NULL DEFAULT 'GENERAL' COMMENT '멘토링 역할',
  `matching_status` ENUM(INACTIVE,SEEKING,MATCHED) NOT NULL DEFAULT 'INACTIVE' COMMENT '멘토링 매칭 상태',
  `partner_id` INT UNIQUE COMMENT '1:1 멘토링 파트너 (자기참조)'
  `mypoints` INT NOT NULL DEFAULT 0 CHECK (`mypoints` >= 0)
);

CREATE TABLE `CoachingLog` (
  `log_id` INT PRIMARY KEY AUTO_INCREMENT,
  `mentor_id` INT,
  `mentee_id` INT,
  `coached_at` DATETIME NOT NULL DEFAULT (now()),
  `content` TEXT COMMENT '코칭 내용'
);

CREATE TABLE `Goal` (
  `goal_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `item_name` VARCHAR(50) NOT NULL,
  `target_date` DATE NOT NULL,
  `is_achieved` BOOLEAN DEFAULT false
);

CREATE TABLE `Attendance` (
  `attendance_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `attended_at` DATETIME NOT NULL,
  `attendance_type` ENUM(수업,헬스장) NOT NULL COMMENT '출석 유형'
);

CREATE TABLE `HealthRecord` (
  `record_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `measured_at` DATE NOT NULL,
  `height_cm` FLOAT,
  `weight_kg` FLOAT,
  `muscle_mass_kg` FLOAT,
  `body_fat_percent` FLOAT,
  `bmi` FLOAT COMMENT '자동 계산 값',
  `memo` VARCHAR(255)
);

CREATE TABLE `ExerciseList` (
  `exercise_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50),
  `calories_per_hour` INT,
  `created_by` INT COMMENT '관리자 또는 회원',
  `status` ENUM(PENDING,APPROVED,REJECTED) NOT NULL DEFAULT 'PENDING' COMMENT '승인 상태'
);

CREATE TABLE `ExerciseLog` (
  `log_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `exercise_id` INT,
  `performed_at` DATETIME NOT NULL DEFAULT (now()),
  `sets` INT DEFAULT 0,
  `reps` INT DEFAULT 0,
  `weight_kg` FLOAT CHECK (weight_kg >= 0) DEFAULT 0,
  `duration_minutes` INT CHECK (duration_minutes >= 0),
  `calories_burned` FLOAT
);

CREATE TABLE `FoodList` (
  `food_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `serving_size_g` INT,
  `calories_per_serving` INT,
  `carbohydrate_g` FLOAT,
  `protein_g` FLOAT,
  `fat_g` FLOAT,
  `created_by` INT COMMENT '관리자 또는 회원',
  `status` ENUM(PENDING,APPROVED,REJECTED) NOT NULL DEFAULT 'PENDING' COMMENT '승인 상태'
);

CREATE TABLE `DietLog` (
  `log_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `food_id` INT,
  `ate_at` DATETIME NOT NULL DEFAULT (now()),
  `meal_type` ENUM(아침,점심,저녁,오전 간식,오후 간식,야식),
  `amount` FLOAT COMMENT '섭취량 (예: 1.5 인분)',
  `calories` FLOAT,
  `image_url` VARCHAR(255) COMMENT '음식 사진 업로드 URL'
);

CREATE TABLE `IncentivePolicy` (
  `policy_id` INT PRIMARY KEY AUTO_INCREMENT,
  `policy_name` VARCHAR(100) NOT NULL COMMENT '예: 5일 연속 출석',
  `policy_type` VARCHAR(50) NOT NULL COMMENT '예: ATTENDANCE_CONSECUTIVE, GOAL_ACHIEVED',
  `condition_value` INT NOT NULL COMMENT '예: 5 (5일), 15 (15일)',
  `points_awarded` INT NOT NULL DEFAULT 0 COMMENT '지급 포인트',
  `policy_frequency` ENUM(ONCE,CUMULATIVE,MONTHLY,WEEKLY) NOT NULL COMMENT '반복 주기'
);

CREATE TABLE `AchievementLog` (
  `achievement_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `policy_id` INT,
  `achieved_at` DATETIME NOT NULL DEFAULT (now()),
  `points_awarded` INT NOT NULL COMMENT '달성 시점의 지급 포인트'
);

CREATE TABLE `PointLedger` (
  `ledger_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `point_change` INT NOT NULL COMMENT '예: +100, -500',
  `reason_type` ENUM(ACHIEVEMENT,REWARD_USED,ADMIN,EXPIRED) NOT NULL,
  `source_id` INT COMMENT 'reason_type에 따른 ID (예: achievement_id, redemption_id)',
  `expires_at` DATETIME NOT NULL COMMENT '포인트 만료일',
  `created_at` DATETIME NOT NULL DEFAULT (now())
);

CREATE TABLE `Reward` (
  `reward_id` INT PRIMARY KEY AUTO_INCREMENT,
  `reward_name` VARCHAR(100) NOT NULL,
  `required_points` INT NOT NULL CHECK (required_points >= 0),
  `stock_quantity` INT NOT NULL CHECK (stock_quantity >= 0) DEFAULT 0 COMMENT '재고 수량'
);

CREATE TABLE `PointRedemption` (
  `redemption_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `reward_id` INT,
  `used_points` INT NOT NULL COMMENT '교환 당시 사용한 포인트',
  `redeemed_at` DATETIME DEFAULT (now()) COMMENT '교환 일자'
);

CREATE TABLE `Class` (
  `class_id` INT PRIMARY KEY AUTO_INCREMENT,
  `class_name` VARCHAR(100) NOT NULL,
  `instructor_id` INT COMMENT '담당자',
  `capacity` INT COMMENT '정원',
  `is_exclusive` BOOLEAN DEFAULT false COMMENT '전용 시간 여부'
);

CREATE TABLE `ClassSchedule` (
  `schedule_id` INT PRIMARY KEY AUTO_INCREMENT,
  `class_id` INT,
  `day_of_week` ENUM(월,화,수,목,금,토,일) NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL
);

CREATE TABLE `ClassRegistration` (
  `registration_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `class_id` INT,
  `registered_at` DATETIME DEFAULT (now())
);

CREATE TABLE `Notice` (
  `notice_id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `created_by` INT COMMENT '관리자 ID',
  `is_pinned` BOOLEAN DEFAULT false COMMENT '상단 고정 여부',
  `start_at` DATE COMMENT '게시 시작일',
  `end_at` DATE COMMENT '게시 종료일',
  `created_at` DATETIME DEFAULT (now()),
  `deleted_at` DATETIME COMMENT '소프트 삭제 일시'
);

CREATE TABLE `NoticeTargetMapping` (
  `mapping_id` INT PRIMARY KEY AUTO_INCREMENT,
  `notice_id` INT,
  `target_type` ENUM(USER_GRADE,PLATFORM) NOT NULL COMMENT '타겟 구분',
  `target_value` VARCHAR(30) NOT NULL COMMENT '예: 1학년, ANDROID'
);

CREATE UNIQUE INDEX `HealthRecord_index_0` ON `HealthRecord` (`member_id`, `measured_at`);

ALTER TABLE `Member` ADD FOREIGN KEY (`partner_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `CoachingLog` ADD FOREIGN KEY (`mentor_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `CoachingLog` ADD FOREIGN KEY (`mentee_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `Goal` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `Attendance` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `HealthRecord` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `ExerciseList` ADD FOREIGN KEY (`created_by`) REFERENCES `Member` (`member_id`);

ALTER TABLE `ExerciseLog` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `ExerciseLog` ADD FOREIGN KEY (`exercise_id`) REFERENCES `ExerciseList` (`exercise_id`);

ALTER TABLE `FoodList` ADD FOREIGN KEY (`created_by`) REFERENCES `Member` (`member_id`);

ALTER TABLE `DietLog` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `DietLog` ADD FOREIGN KEY (`food_id`) REFERENCES `FoodList` (`food_id`);

ALTER TABLE `AchievementLog` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `AchievementLog` ADD FOREIGN KEY (`policy_id`) REFERENCES `IncentivePolicy` (`policy_id`);

ALTER TABLE `PointLedger` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `PointRedemption` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `PointRedemption` ADD FOREIGN KEY (`reward_id`) REFERENCES `Reward` (`reward_id`);

ALTER TABLE `Class` ADD FOREIGN KEY (`instructor_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `ClassSchedule` ADD FOREIGN KEY (`class_id`) REFERENCES `Class` (`class_id`);

ALTER TABLE `ClassRegistration` ADD FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`);

ALTER TABLE `ClassRegistration` ADD FOREIGN KEY (`class_id`) REFERENCES `Class` (`class_id`);

ALTER TABLE `Notice` ADD FOREIGN KEY (`created_by`) REFERENCES `Member` (`member_id`);

ALTER TABLE `NoticeTargetMapping` ADD FOREIGN KEY (`notice_id`) REFERENCES `Notice` (`notice_id`);

ALTER TABLE `PointLedger` ADD FOREIGN KEY (`source_id`) REFERENCES `AchievementLog` (`achievement_id`);

ALTER TABLE `PointLedger` ADD FOREIGN KEY (`source_id`) REFERENCES `PointRedemption` (`redemption_id`);
