CREATE TABLE `Member` (
  `member_id` INT PRIMARY KEY AUTO_INCREMENT,
  `student_no` CHAR(8) UNIQUE NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  `contact` CHAR(13) UNIQUE NOT NULL,
  `department` VARCHAR(50) NOT NULL,
  `grade` INT CHECK (grade BETWEEN 1 AND 4),
  `status` ENUM('재학','휴학','졸업') NOT NULL DEFAULT '재학',
  `role_type` ENUM('GENERAL','MENTOR','MENTEE') NOT NULL DEFAULT 'GENERAL',
  `matching_status` ENUM('INACTIVE','SEEKING','MATCHED') NOT NULL DEFAULT 'INACTIVE',
  `partner_id` INT UNIQUE,
  `mypoints` INT NOT NULL DEFAULT 0 CHECK (`mypoints` >= 0)
);

CREATE TABLE `Reward` (
  `reward_id` INT PRIMARY KEY AUTO_INCREMENT,
  `reward_name` VARCHAR(100) NOT NULL,
  `required_points` INT NOT NULL CHECK (required_points >= 0),
  `stock_quantity` INT NOT NULL CHECK (stock_quantity >= 0) DEFAULT 0
);

CREATE TABLE `ExerciseList` (
  `exercise_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50),
  `calories_per_hour` INT,
  `created_by` INT,
  `status` ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE `FoodList` (
  `food_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `serving_size_g` INT,
  `calories_per_serving` INT,
  `carbohydrate_g` FLOAT,
  `protein_g` FLOAT,
  `fat_g` FLOAT,
  `created_by` INT,
  `status` ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE `Goal` (
  `goal_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `item_name` VARCHAR(50) NOT NULL,
  `target_date` DATE NOT NULL,
  `is_achieved` BOOLEAN DEFAULT false
);

CREATE TABLE `HealthRecord` (
  `record_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `measured_at` DATE NOT NULL,
  `height_cm` FLOAT,
  `weight_kg` FLOAT,
  `muscle_mass_kg` FLOAT,
  `body_fat_percent` FLOAT,
  `bmi` FLOAT,
  `memo` VARCHAR(255)
);

CREATE TABLE `CoachingLog` (
  `log_id` INT PRIMARY KEY AUTO_INCREMENT,
  `mentor_id` INT,
  `mentee_id` INT,
  `coached_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` TEXT
);

CREATE TABLE `ExerciseLog` (
  `log_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `exercise_id` INT,
  `performed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sets` INT DEFAULT 0,
  `reps` INT DEFAULT 0,
  `weight_kg` FLOAT CHECK (weight_kg >= 0) DEFAULT 0,
  `duration_minutes` INT CHECK (duration_minutes >= 0),
  `calories_burned` FLOAT
);

CREATE TABLE `DietLog` (
  `log_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `food_id` INT,
  `ate_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `meal_type` ENUM('아침','점심','저녁','오전 간식','오후 간식','야식'),
  `amount` FLOAT,
  `calories` FLOAT,
  `image_url` VARCHAR(255)
);

CREATE TABLE `Attendance` (
  `attendance_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `attended_at` DATETIME NOT NULL,
  `attendance_type` ENUM('수업','헬스장') NOT NULL
);

CREATE TABLE `IncentivePolicy` (
  `policy_id` INT PRIMARY KEY AUTO_INCREMENT,
  `policy_name` VARCHAR(100) NOT NULL,
  `policy_type` VARCHAR(50) NOT NULL,
  `condition_value` INT NOT NULL,
  `points_awarded` INT NOT NULL DEFAULT 0,
  `policy_frequency` ENUM('ONCE','CUMULATIVE','MONTHLY','WEEKLY') NOT NULL
);

CREATE TABLE `AchievementLog` (
  `achievement_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `policy_id` INT,
  `achieved_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `points_awarded` INT NOT NULL
);

CREATE TABLE `PointLedger` (
  `ledger_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `point_change` INT NOT NULL,
  `reason_type` ENUM('ACHIEVEMENT','REWARD_USED','ADMIN','EXPIRED') NOT NULL,
  `source_id` INT,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `PointRedemption` (
  `redemption_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `reward_id` INT,
  `used_points` INT NOT NULL,
  `redeemed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `Class` (
  `class_id` INT PRIMARY KEY AUTO_INCREMENT,
  `class_name` VARCHAR(100) NOT NULL,
  `instructor_id` INT,
  `capacity` INT,
  `is_exclusive` BOOLEAN DEFAULT false
);

CREATE TABLE `ClassSchedule` (
  `schedule_id` INT PRIMARY KEY AUTO_INCREMENT,
  `class_id` INT,
  `day_of_week` ENUM('월','화','수','목','금','토','일') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL
);

CREATE TABLE `ClassRegistration` (
  `registration_id` INT PRIMARY KEY AUTO_INCREMENT,
  `member_id` INT,
  `class_id` INT,
  `registered_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `Notice` (
  `notice_id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `created_by` INT,
  `is_pinned` BOOLEAN DEFAULT false,
  `start_at` DATE,
  `end_at` DATE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME
);

CREATE TABLE `NoticeTargetMapping` (
  `mapping_id` INT PRIMARY KEY AUTO_INCREMENT,
  `notice_id` INT,
  `target_type` ENUM('USER_GRADE','PLATFORM') NOT NULL,
  `target_value` VARCHAR(30) NOT NULL
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
