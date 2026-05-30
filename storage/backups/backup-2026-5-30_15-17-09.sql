-- E-SF10 MySQL Backup
-- Format: mysql-sql-v1
-- Exported At: 2026-05-30T07:17:09.993Z
-- Source Database: esf_db_v2

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS `esf_db_v2`;
CREATE DATABASE IF NOT EXISTS `esf_db_v2` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `esf_db_v2`;

DROP TABLE IF EXISTS `sf10_certifications`;
DROP TABLE IF EXISTS `eligibility_records`;
DROP TABLE IF EXISTS `remedial_classes`;
DROP TABLE IF EXISTS `student_grades`;
DROP TABLE IF EXISTS `scholastic_records`;
DROP TABLE IF EXISTS `sf10_records`;
DROP TABLE IF EXISTS `user_permissions`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `modules`;
DROP TABLE IF EXISTS `student_religions`;
DROP TABLE IF EXISTS `student_indigenous_groups`;
DROP TABLE IF EXISTS `student_mother_tongues`;
DROP TABLE IF EXISTS `student_guardians`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `sections`;
DROP TABLE IF EXISTS `teachers`;
DROP TABLE IF EXISTS `school_years`;
DROP TABLE IF EXISTS `schools`;
DROP TABLE IF EXISTS `religions`;
DROP TABLE IF EXISTS `indigenous_groups`;
DROP TABLE IF EXISTS `mother_tongues`;
DROP TABLE IF EXISTS `guardians`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `positions`;
DROP TABLE IF EXISTS `users`;

-- Structure for table `modules`
CREATE TABLE `modules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `modules_slug_unique` (`slug`),
  KEY `idx_modules_sort_order` (`sort_order`),
  KEY `idx_modules_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `permissions`
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `module_id` bigint unsigned NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_slug_unique` (`slug`),
  KEY `idx_permissions_module_id` (`module_id`),
  KEY `idx_permissions_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_permissions_module_id` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `roles`
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`),
  KEY `idx_roles_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `positions`
CREATE TABLE `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `acronym` varchar(20) NOT NULL,
  `full_position` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_positions_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure for table `subjects`
CREATE TABLE `subjects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_group` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade_levels` json NOT NULL,
  `is_optional` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subjects_name_unique` (`name`),
  KEY `idx_subjects_deleted_at` (`deleted_at`),
  KEY `idx_subjects_sort_order` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=351 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `schools`
CREATE TABLE `schools` (
  `school_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `deped_school_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `division` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deped_logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`school_id`),
  UNIQUE KEY `schools_deped_school_id_unique` (`deped_school_id`),
  KEY `idx_schools_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `school_years`
CREATE TABLE `school_years` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `school_years_name_unique` (`name`),
  KEY `idx_school_years_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `users`
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barangay` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `municipality_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roles` json DEFAULT NULL,
  `position` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `profile_picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suffix` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sex` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`),
  KEY `idx_users_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `teachers`
CREATE TABLE `teachers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `teachers_user_id_unique` (`user_id`),
  KEY `idx_teachers_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_teachers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `sections`
CREATE TABLE `sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_year_id` bigint unsigned NOT NULL,
  `grade_level` tinyint unsigned NOT NULL,
  `section_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adviser_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sections_year_grade_name_unique` (`school_year_id`,`grade_level`,`section_name`),
  KEY `idx_sections_deleted_at` (`deleted_at`),
  KEY `fk_sections_adviser` (`adviser_id`),
  CONSTRAINT `fk_sections_adviser` FOREIGN KEY (`adviser_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sections_school_year` FOREIGN KEY (`school_year_id`) REFERENCES `school_years` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `guardians`
CREATE TABLE `guardians` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `middlename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `suffix` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relationship` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'guardian',
  `contact_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `barangay` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `municipality_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_guardians_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `mother_tongues`
CREATE TABLE `mother_tongues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mother_tongues_name_unique` (`name`),
  KEY `idx_mother_tongues_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1652 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `indigenous_groups`
CREATE TABLE `indigenous_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `indigenous_groups_name_unique` (`name`),
  KEY `idx_indigenous_groups_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `religions`
CREATE TABLE `religions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `religions_name_unique` (`name`),
  KEY `idx_religions_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1361 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `role_permissions`
CREATE TABLE `role_permissions` (
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `idx_role_permissions_permission_id` (`permission_id`),
  KEY `idx_role_permissions_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_role_permissions_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_role_permissions_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `user_roles`
CREATE TABLE `user_roles` (
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `idx_user_roles_role_id` (`role_id`),
  KEY `idx_user_roles_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_user_roles_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_roles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `user_permissions`
CREATE TABLE `user_permissions` (
  `user_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `type` enum('allow','deny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`permission_id`),
  KEY `idx_user_permissions_permission_id` (`permission_id`),
  KEY `idx_user_permissions_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_user_permissions_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_permissions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `students`
CREATE TABLE `students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lrn` varchar(20) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `sex` enum('male','female') NOT NULL,
  `birthdate` date NOT NULL,
  `birthplace` varchar(150) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `barangay` varchar(100) NOT NULL,
  `city_municipality` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `region` varchar(100) NOT NULL,
  `status` enum('active','inactive','transferred','graduated') DEFAULT 'active',
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lrn` (`lrn`),
  UNIQUE KEY `students_lrn_unique` (`lrn`),
  KEY `idx_students_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure for table `sf10_records`
CREATE TABLE `sf10_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `school_id` bigint unsigned DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint unsigned DEFAULT NULL,
  `verified_by` bigint unsigned DEFAULT NULL,
  `certified_by` bigint unsigned DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sf10_records_deleted_at` (`deleted_at`),
  KEY `fk_sf10_records_student` (`student_id`),
  KEY `fk_sf10_records_school` (`school_id`),
  KEY `fk_sf10_records_created_by` (`created_by`),
  KEY `fk_sf10_records_verified_by` (`verified_by`),
  KEY `fk_sf10_records_certified_by` (`certified_by`),
  CONSTRAINT `fk_sf10_records_certified_by` FOREIGN KEY (`certified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sf10_records_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sf10_records_school` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sf10_records_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sf10_records_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `scholastic_records`
CREATE TABLE `scholastic_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sf10_record_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `school_id` bigint unsigned DEFAULT NULL,
  `school_year_id` bigint unsigned NOT NULL,
  `section_id` bigint unsigned DEFAULT NULL,
  `adviser_id` bigint unsigned DEFAULT NULL,
  `grade_level` tinyint unsigned NOT NULL,
  `section_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `division` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `general_average` decimal(5,2) DEFAULT NULL,
  `final_remarks` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scholastic_records_sf10_grade_unique` (`sf10_record_id`,`grade_level`,`school_year_id`),
  KEY `idx_scholastic_records_deleted_at` (`deleted_at`),
  KEY `fk_scholastic_records_student` (`student_id`),
  KEY `fk_scholastic_records_school` (`school_id`),
  KEY `fk_scholastic_records_school_year` (`school_year_id`),
  KEY `fk_scholastic_records_section` (`section_id`),
  KEY `fk_scholastic_records_adviser` (`adviser_id`),
  CONSTRAINT `fk_scholastic_records_adviser` FOREIGN KEY (`adviser_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_scholastic_records_school` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_scholastic_records_school_year` FOREIGN KEY (`school_year_id`) REFERENCES `school_years` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_scholastic_records_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_scholastic_records_sf10` FOREIGN KEY (`sf10_record_id`) REFERENCES `sf10_records` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_scholastic_records_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `student_grades`
CREATE TABLE `student_grades` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `scholastic_record_id` bigint unsigned NOT NULL,
  `subject_id` bigint unsigned NOT NULL,
  `quarter_1` decimal(5,2) DEFAULT NULL,
  `quarter_2` decimal(5,2) DEFAULT NULL,
  `quarter_3` decimal(5,2) DEFAULT NULL,
  `quarter_4` decimal(5,2) DEFAULT NULL,
  `final_rating` decimal(5,2) DEFAULT NULL,
  `remarks` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_grades_record_subject_unique` (`scholastic_record_id`,`subject_id`),
  KEY `idx_student_grades_deleted_at` (`deleted_at`),
  KEY `fk_student_grades_subject` (`subject_id`),
  CONSTRAINT `fk_student_grades_record` FOREIGN KEY (`scholastic_record_id`) REFERENCES `scholastic_records` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_student_grades_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `remedial_classes`
CREATE TABLE `remedial_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `scholastic_record_id` bigint unsigned NOT NULL,
  `subject_id` bigint unsigned NOT NULL,
  `date_from` date DEFAULT NULL,
  `date_to` date DEFAULT NULL,
  `final_rating` decimal(5,2) DEFAULT NULL,
  `remedial_class_mark` decimal(5,2) DEFAULT NULL,
  `recomputed_final_grade` decimal(5,2) DEFAULT NULL,
  `remarks` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_remedial_classes_deleted_at` (`deleted_at`),
  KEY `fk_remedial_classes_subject` (`subject_id`),
  KEY `fk_remedial_classes_record` (`scholastic_record_id`),
  CONSTRAINT `fk_remedial_classes_record` FOREIGN KEY (`scholastic_record_id`) REFERENCES `scholastic_records` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_remedial_classes_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `eligibility_records`
CREATE TABLE `eligibility_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `sf10_record_id` bigint unsigned DEFAULT NULL,
  `credential_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id_text` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pept_rating` decimal(5,2) DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `testing_center` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_credential` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_eligibility_records_deleted_at` (`deleted_at`),
  KEY `fk_eligibility_records_student` (`student_id`),
  KEY `fk_eligibility_records_sf10` (`sf10_record_id`),
  CONSTRAINT `fk_eligibility_records_sf10` FOREIGN KEY (`sf10_record_id`) REFERENCES `sf10_records` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_eligibility_records_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `sf10_certifications`
CREATE TABLE `sf10_certifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sf10_record_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `eligible_for_grade` tinyint unsigned DEFAULT NULL,
  `school_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id_text` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `division` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_school_year_attended` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certification_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sf10_certifications_sf10_unique` (`sf10_record_id`),
  KEY `idx_sf10_certifications_deleted_at` (`deleted_at`),
  KEY `fk_sf10_certifications_student` (`student_id`),
  CONSTRAINT `fk_sf10_certifications_sf10` FOREIGN KEY (`sf10_record_id`) REFERENCES `sf10_records` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sf10_certifications_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `student_mother_tongues`
CREATE TABLE `student_mother_tongues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `mother_tongue_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_mother_tongues_student_unique` (`student_id`),
  KEY `fk_pmt_mother_tongue` (`mother_tongue_id`),
  KEY `idx_student_mother_tongues_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_pmt_mother_tongue` FOREIGN KEY (`mother_tongue_id`) REFERENCES `mother_tongues` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pmt_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `student_indigenous_groups`
CREATE TABLE `student_indigenous_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `indigenous_group_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_indigenous_groups_student_unique` (`student_id`),
  KEY `fk_pig_indigenous_group` (`indigenous_group_id`),
  KEY `idx_student_indigenous_groups_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_pig_indigenous_group` FOREIGN KEY (`indigenous_group_id`) REFERENCES `indigenous_groups` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pig_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `student_religions`
CREATE TABLE `student_religions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `religion_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_religions_student_unique` (`student_id`),
  KEY `fk_pr_religion` (`religion_id`),
  KEY `idx_student_religions_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_pr_religion` FOREIGN KEY (`religion_id`) REFERENCES `religions` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pr_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure for table `student_guardians`
CREATE TABLE `student_guardians` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `guardian_id` bigint unsigned NOT NULL,
  `relationship` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pg_guardian` (`guardian_id`),
  KEY `idx_student_guardians_deleted_at` (`deleted_at`),
  KEY `fk_pg_student` (`student_id`),
  CONSTRAINT `fk_pg_guardian` FOREIGN KEY (`guardian_id`) REFERENCES `guardians` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pg_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

START TRANSACTION;

-- Data for table `modules`
INSERT INTO `modules` (`id`, `name`, `slug`, `icon`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Student Management', 'student', 'users', 1, '2026-04-01 09:00:00', '2026-05-28 02:38:52', NULL),
(2, 'Grades', 'grades', 'chart', 2, '2026-04-01 09:10:00', '2026-04-01 09:10:00', NULL),
(3, 'Reports', 'reports', 'document', 3, '2026-04-01 09:20:00', '2026-04-01 09:20:00', NULL),
(4, 'Users', 'user', 'users', 4, '2026-04-01 09:30:00', '2026-04-01 09:30:00', NULL);

-- Data for table `permissions`
INSERT INTO `permissions` (`id`, `module_id`, `name`, `slug`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'View Students', 'student.view', 'Access the student listing and profiles.', '2026-04-01 10:00:00', '2026-05-28 02:38:53', NULL),
(2, 1, 'Create Student', 'student.create', 'Register a new student record.', '2026-04-01 10:05:00', '2026-05-28 02:38:53', NULL),
(3, 1, 'Update Student', 'student.update', 'Modify student profile details.', '2026-04-01 10:10:00', '2026-05-28 02:38:53', NULL),
(4, 2, 'View Grades', 'grades.view', 'Open grade sheets and grade summaries.', '2026-04-01 10:20:00', '2026-04-01 10:20:00', NULL),
(5, 2, 'Encode Grades', 'grades.encode', 'Input quarterly and final grades.', '2026-04-01 10:25:00', '2026-04-01 10:25:00', NULL),
(6, 2, 'Publish Grades', 'grades.publish', 'Release grade results to users.', '2026-04-01 10:30:00', '2026-04-01 10:30:00', NULL),
(7, 3, 'View Reports', 'reports.view', 'Access report listings and details.', '2026-04-01 10:40:00', '2026-04-01 10:40:00', NULL),
(8, 3, 'Generate Reports', 'reports.generate', 'Generate report output based on filters.', '2026-04-01 10:45:00', '2026-04-01 10:45:00', NULL),
(9, 3, 'Export Reports', 'reports.export', 'Export reports to file formats.', '2026-04-01 10:50:00', '2026-04-01 10:50:00', NULL),
(10, 4, 'Can View', 'user.can_view', 'Allow access to the users listing and profile details.', '2026-04-01 11:00:00', '2026-04-01 11:00:00', NULL),
(11, 4, 'Can Add', 'user.can_add', 'Allow creation of new user accounts.', '2026-04-01 11:05:00', '2026-04-01 11:05:00', NULL),
(12, 4, 'Can Edit', 'user.can_edit', 'Allow editing of existing user information.', '2026-04-01 11:10:00', '2026-04-01 11:10:00', NULL),
(13, 4, 'Can Delete', 'user.can_delete', 'Allow deletion of user records.', '2026-04-01 11:15:00', '2026-04-01 11:15:00', NULL),
(14, 4, 'Can Update Status', 'user.can_update_status', 'Allow updating the active, inactive, or banned status of a user.', '2026-04-01 11:20:00', '2026-04-01 11:20:00', NULL);

-- Data for table `roles`
INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'admin', 'Full access to all modules and configuration.', '2026-04-01 08:00:00', '2026-04-01 08:00:00', NULL),
(2, 'teacher', 'Can manage student records, grades, and related workflows.', '2026-04-02 08:00:00', '2026-05-28 02:38:53', '2026-04-24 21:25:35'),
(3, 'staff', 'Handles enrollment, reports, and academic documentation.', '2026-04-03 08:00:00', '2026-04-24 20:24:09', NULL),
(4, 'developer', 'Full access for development, testing, and system configuration.', '2026-04-04 08:00:00', '2026-04-04 08:00:00', NULL),
(5, 'sample', 'This sample', '2026-04-19 19:11:28', '2026-04-24 20:24:16', '2026-04-24 20:24:16'),
(6, 'users', 'This is user role', '2026-04-24 21:26:00', '2026-04-24 21:26:00', NULL);

-- Data for table `positions`
INSERT INTO `positions` (`id`, `acronym`, `full_position`, `category`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'T-I', 'Teacher I', 'Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(2, 'T-II', 'Teacher II', 'Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(3, 'T-III', 'Teacher III', 'Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(4, 'MT-I', 'Master Teacher I', 'Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(5, 'MT-II', 'Master Teacher II', 'Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(6, 'SPED-T', 'Special Education Teacher', 'Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(7, 'K-T', 'Kindergarten Teacher', 'Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(8, 'HT-I', 'Head Teacher I', 'School Administration', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(9, 'HT-II', 'Head Teacher II', 'School Administration', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(10, 'HT-III', 'Head Teacher III', 'School Administration', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(11, 'SP-I', 'School Principal I', 'School Administration', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(12, 'SP-II', 'School Principal II', 'School Administration', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(13, 'SP-III', 'School Principal III', 'School Administration', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(14, 'SP-IV', 'School Principal IV', 'School Administration', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(15, 'PSDS', 'Public Schools District Supervisor', 'School Administration', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(16, 'GC', 'Guidance Counselor', 'Support Services', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(17, 'LIB', 'Librarian', 'Support Services', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(18, 'EPS', 'Education Program Specialist', 'Support Services', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(19, 'SN', 'School Nurse', 'Support Services', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(20, 'REG', 'Registrar', 'Support Services', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(21, 'AO-I', 'Administrative Officer I', 'Non-Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(22, 'AO-II', 'Administrative Officer II', 'Non-Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(23, 'AO-III', 'Administrative Officer III', 'Non-Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(24, 'ADAS', 'Administrative Assistant', 'Non-Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(25, 'CLK', 'Clerk', 'Non-Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(26, 'RO', 'Records Officer', 'Non-Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(27, 'CASH', 'Cashier', 'Non-Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL),
(28, 'UTY', 'Utility Worker', 'Non-Teaching', '2026-04-24 20:34:37', '2026-04-24 20:34:37', NULL);

-- Data for table `subjects`
INSERT INTO `subjects` (`id`, `name`, `subject_group`, `grade_levels`, `is_optional`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Mother Tongue', 'Core', '[1,2,3]', 0, 1, 1, '2026-05-30 13:05:38', '2026-05-30 13:17:28', NULL),
(2, 'Filipino', 'Core', '[1,2,3,4,5,6]', 0, 2, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(3, 'English', 'Core', '[1,2,3,4,5,6]', 0, 3, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(4, 'Mathematics', 'Core', '[1,2,3,4,5,6]', 0, 4, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(5, 'Science', 'Core', '[1,2,3,4,5,6]', 0, 5, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(6, 'Araling Panlipunan', 'Core', '[1,2,3,4,5,6]', 0, 6, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(7, 'EPP', 'EPP / TLE', '[4,5,6]', 0, 7, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(8, 'Music', 'MAPEH', '[1,2,3,4,5,6]', 0, 8, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(9, 'Arts', 'MAPEH', '[1,2,3,4,5,6]', 0, 9, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(10, 'Physical Education', 'MAPEH', '[1,2,3,4,5,6]', 0, 10, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(11, 'Health', 'MAPEH', '[1,2,3,4,5,6]', 0, 11, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(12, 'Edukasyon sa Pagpapakatao', 'Core', '[1,2,3,4,5,6]', 0, 12, 1, '2026-05-30 13:05:38', '2026-05-30 13:05:38', NULL),
(13, 'Arabic Language', 'ALIVE Program', '[1,2,3,4,5,6]', 1, 13, 1, '2026-05-30 13:05:38', '2026-05-30 13:50:30', NULL),
(14, 'Islamic Values Education', 'ALIVE Program', '[1,2,3,4,5,6]', 1, 14, 1, '2026-05-30 13:05:38', '2026-05-30 13:50:30', NULL);

-- Data for table `schools`
INSERT INTO `schools` (`school_id`, `deped_school_id`, `school_name`, `school_email`, `school_number`, `district`, `division`, `region`, `address`, `school_logo`, `deped_logo`, `other_logo`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '118768', 'Trinidad Central Elementary School', 'school@gmail.com', '09952788209', 'Trinidad I', 'Bohol', 'Region VII', 'Purok 1, Poblacion, Trinidad, Bohol', '/uploads/images/1780026358756-6197b350-a67f-4a4c-925b-d6a7feda56a4-newlogs.png', '/uploads/images/1780023838255-2ff466e8-127e-4da2-a3bf-399191aaadd5-DepED-Logo.png', '/uploads/images/1780023838263-f0cb3839-4145-4e09-a961-0b1a6aca2844-1280px-Seal_of_the_Department_of_Education_of_the_Philippines.png', '2026-05-29 10:50:45', '2026-05-29 22:21:45', NULL);

-- Data for table `school_years`
INSERT INTO `school_years` (`id`, `name`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '2026-2027', '2026-06-08', '2027-04-09', 1, '2026-05-30 14:54:33', '2026-05-30 14:54:33', NULL);

-- Data for table `users`
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `first_name`, `middle_name`, `last_name`, `suffix`, `sex`, `contact_number`, `address`, `barangay`, `municipality_city`, `province`, `region`, `username`, `roles`, `position`, `status`, `profile_picture`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Mark Emil Cajes Dacoylo', 'markemil.dacoylo13@gmail.com', '$2b$10$h/OBbq0OodeJ/YXyDOsE8e1m//RG8Oznq6i2ciI1K7UbZ05aZ/o0C', 'Mark Emil', 'Cajes', 'Dacoylo', NULL, 'male', '09952788209', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', 'dacs1993', '[\"admin\",\"developer\"]', 'Administrative Assistant', 'active', '/uploads/images/1780027050609-7729f807-cc79-4229-a746-188359f96f43-profile-picture.jpg', '2026-04-18 18:23:37', '2026-05-29 23:16:11', NULL),
(2, 'Mark2 Dacoylo2', 'elee39927@gmail.com', '$2b$10$itDgEPS5Eh8pCLoYiIaaSujNjS5hv732.zSJL5MHh58w8fMS6ltTG', 'Mark2', NULL, 'Dacoylo2', NULL, 'male', '09952788209', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', 'markdacs', '[\"admin\",\"developer\"]', 'Administrative Officer III', 'active', '/uploads/images/1780036428730-5c281f3f-efc1-4671-9875-ce99bf480077-profile-picture.jpg', '2026-04-19 07:12:40', '2026-05-30 12:19:39', NULL),
(3, 'Upload Guard', 'upload.auth.20260419105449@example.com', '$2b$10$34faAx6lyyQWlQXRHSWWJer8hUCP3Tr4hKTXhz3ieREE7iae71nhi', 'Upload', NULL, 'Guard', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"user\"]', NULL, 'inactive', NULL, '2026-04-19 10:54:49', '2026-04-19 19:10:48', '2026-04-19 19:10:48'),
(4, 'Upload File', 'upload.fileauth.20260419105511@example.com', '$2b$10$K1YtE/9W.bQbZVfoBR.AmuHDng9Y1M3OU4Lyp2I3Gs6dqkqAF5cBy', 'Upload', NULL, 'File', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"user\"]', NULL, 'inactive', NULL, '2026-04-19 10:55:12', '2026-04-19 19:10:45', '2026-04-19 19:10:45'),
(5, 'Upload File', 'upload.fileauth2.20260419105532@example.com', '$2b$10$grQS3jDaQavqg/YJtu1UAeRzasV3rKodJyhN9BYosx36aXKY2xPqW', 'Upload', NULL, 'File', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"user\"]', NULL, 'inactive', NULL, '2026-04-19 10:55:32', '2026-04-19 19:10:38', '2026-04-19 19:10:38'),
(6, 'Emil Dacoy', 'markemildacoylo209@gmail.com', '$2b$10$bA0/zDO9F6THIxQM3MHrSetpL2i2yQEmIxCITcMVWuNyyfpaEL6IW', 'Emil', NULL, 'Dacoy', NULL, 'male', '09952788209', 'Purok 2', 'Tagum Norte', 'Trinidad', 'Bohol', 'Region VII', 'emil.dacoylo', '[\"admin\",\"developer\"]', 'School Principal I', 'active', '/uploads/images/1780114388785-1d6ad011-8482-46cd-a085-c8bc64edbc2e-profile-picture.png', '2026-04-24 21:24:40', '2026-05-30 12:13:48', NULL),
(7, 'Em f Dacoylo', 'emil12@gmail.com', '$2b$10$AlZuwl5bdTWwL/bDZeJ/QuxuCM3eu.ng3N2CH5b3cUPj8yDjkvVVG', 'Em', 'f', 'Dacoylo', NULL, 'male', '09952788209', 'purok 2', 'Guinobatan', 'Trinidad', 'Bohol', 'Region VII', 'sampl.em', '[\"developer\",\"staff\",\"admin\"]', 'Teacher III', 'active', '/uploads/images/1780114358202-c4f65d44-c13b-40f7-8c05-822e0cb2e9ff-profile-picture.jpg', '2026-04-26 14:13:00', '2026-05-30 12:12:38', NULL);

-- Data for table `teachers`
INSERT INTO `teachers` (`id`, `user_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 7, '2026-05-30 15:09:26', '2026-05-30 15:09:26', NULL);

-- Data for table `guardians`
INSERT INTO `guardians` (`id`, `firstname`, `middlename`, `lastname`, `suffix`, `relationship`, `contact_number`, `address`, `barangay`, `municipality_city`, `province`, `region`, `profile_picture`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Mary Zosineil', 'Sarabia', 'Dacoylo', NULL, 'Uncle', '099999999999', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', '/uploads/images/1780026586260-ecc76c35-6b4c-4239-bf53-df4172c232d9-profile-picture.jpg', '2026-05-28 01:48:25', '2026-05-29 11:49:46', NULL);

-- Data for table `mother_tongues`
INSERT INTO `mother_tongues` (`id`, `name`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Filipino / Tagalog', 1, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(2, 'Cebuano / Bisaya', 2, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(3, 'Ilocano', 3, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(4, 'Hiligaynon (Ilonggo)', 4, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(5, 'Waray', 5, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(6, 'Kapampangan', 6, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(7, 'Pangasinan', 7, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(8, 'Bikol / Bicolano', 8, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(9, 'Maranao', 9, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(10, 'Maguindanaoan', 10, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(11, 'Tausug', 11, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(12, 'Chavacano', 12, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(13, 'Ivatan', 13, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(14, 'Ifugao', 14, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(15, 'Kankanaey', 15, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(16, 'Ibaloi', 16, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(17, 'N/A', 17, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL);

-- Data for table `indigenous_groups`
INSERT INTO `indigenous_groups` (`id`, `name`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Aeta / Agta', 1, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(2, 'Igorot', 2, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(3, 'Ifugao', 3, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(4, 'Bontoc', 4, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(5, 'Kankanaey', 5, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(6, 'Ibaloi', 6, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(7, 'Mangyan', 7, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(8, 'Iraya', 8, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(9, 'Alangan', 9, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(10, 'Tadyawan', 10, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(11, 'Lumad', 11, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(12, 'Manobo', 12, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(13, 'T\'boli', 13, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(14, 'Subanen', 14, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(15, 'B\'laan', 15, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(16, 'Higaonon', 16, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(17, 'Badjao / Sama-Bajau', 17, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(18, 'Tausug (also ethnic group in Sulu)', 18, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(19, 'Maranao', 19, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(20, 'Yakan', 20, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(21, 'Non-IP / Not Applicable', 21, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(22, 'Other', 22, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL);

-- Data for table `religions`
INSERT INTO `religions` (`id`, `name`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Roman Catholic', 1, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(2, 'Islam', 2, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(3, 'Iglesia ni Cristo', 3, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(4, 'Born Again Christian', 4, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(5, 'Protestant', 5, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(6, 'Seventh-day Adventist', 6, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(7, 'Jehovah\'s Witnesses', 7, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(8, 'Baptist', 8, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(9, 'Evangelical', 9, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(10, 'LDS / Mormon', 10, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(11, 'Hinduism', 11, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(12, 'Buddhism', 12, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(13, 'Other Christian Denominations', 13, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL),
(14, 'N/A', 14, 1, '2026-05-28 01:56:02', '2026-05-28 01:56:02', NULL);

-- Data for table `role_permissions`
INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`, `deleted_at`) VALUES
(1, 1, '2026-04-19 12:51:55', NULL),
(1, 2, '2026-04-19 12:51:55', NULL),
(1, 3, '2026-04-19 12:51:55', NULL),
(1, 4, '2026-04-19 12:51:55', NULL),
(1, 5, '2026-04-19 12:51:55', NULL),
(1, 6, '2026-04-19 12:51:55', NULL),
(1, 7, '2026-04-19 12:51:55', NULL),
(1, 8, '2026-04-19 12:51:55', NULL),
(1, 9, '2026-04-19 12:51:55', NULL),
(1, 10, '2026-04-19 12:51:55', NULL),
(1, 11, '2026-04-19 12:51:55', NULL),
(1, 12, '2026-04-19 12:51:55', NULL),
(1, 13, '2026-04-19 12:51:55', NULL),
(1, 14, '2026-04-19 12:51:55', NULL),
(2, 1, '2026-04-19 12:51:55', '2026-04-24 21:25:35'),
(2, 3, '2026-04-19 12:51:55', '2026-04-24 21:25:35'),
(2, 4, '2026-04-19 12:51:55', '2026-04-24 21:25:35'),
(2, 5, '2026-04-19 12:51:55', '2026-04-24 21:25:35'),
(2, 6, '2026-04-19 12:51:55', '2026-04-24 21:25:35'),
(2, 7, '2026-04-19 12:51:55', '2026-04-24 21:25:35'),
(3, 1, '2026-04-19 12:51:55', '2026-04-24 20:19:21'),
(3, 7, '2026-04-19 12:51:55', '2026-04-24 20:19:21'),
(3, 8, '2026-04-19 12:51:55', '2026-04-24 20:19:21'),
(3, 9, '2026-04-19 12:51:55', '2026-04-24 20:19:21'),
(4, 1, '2026-04-19 12:51:55', NULL),
(4, 2, '2026-04-19 12:51:55', NULL),
(4, 3, '2026-04-19 12:51:55', NULL),
(4, 4, '2026-04-19 12:51:55', NULL),
(4, 5, '2026-04-19 12:51:55', NULL),
(4, 6, '2026-04-19 12:51:55', NULL),
(4, 7, '2026-04-19 12:51:55', NULL),
(4, 8, '2026-04-19 12:51:55', NULL),
(4, 9, '2026-04-19 12:51:55', NULL),
(4, 10, '2026-04-19 12:51:55', NULL),
(4, 11, '2026-04-19 12:51:55', NULL),
(4, 12, '2026-04-19 12:51:55', NULL),
(4, 13, '2026-04-19 12:51:55', NULL),
(4, 14, '2026-04-19 12:51:55', NULL),
(5, 10, '2026-04-19 19:11:54', '2026-04-24 20:24:16'),
(5, 11, '2026-04-19 19:11:54', '2026-04-24 20:24:16'),
(5, 12, '2026-04-19 19:11:54', '2026-04-24 20:24:16'),
(5, 13, '2026-04-19 19:11:54', '2026-04-24 20:24:16'),
(5, 14, '2026-04-19 19:11:54', '2026-04-24 20:24:16'),
(6, 4, '2026-04-24 21:26:14', NULL),
(6, 5, '2026-04-24 21:26:14', NULL),
(6, 6, '2026-04-24 21:26:14', NULL),
(6, 7, '2026-04-24 21:26:08', NULL),
(6, 8, '2026-04-24 21:26:08', NULL),
(6, 9, '2026-04-24 21:26:08', NULL),
(6, 10, '2026-04-24 21:26:06', '2026-04-26 18:16:12'),
(6, 11, '2026-04-24 21:26:06', '2026-04-26 18:16:12'),
(6, 12, '2026-04-24 21:26:06', '2026-04-26 18:16:12'),
(6, 13, '2026-04-24 21:26:06', '2026-04-26 18:16:12'),
(6, 14, '2026-04-24 21:26:06', '2026-04-26 18:16:12');

-- Data for table `user_roles`
INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `deleted_at`) VALUES
(1, 1, '2026-04-05 08:00:00', NULL),
(2, 2, '2026-04-05 08:10:00', '2026-04-24 21:25:35'),
(4, 3, '2026-04-05 08:20:00', '2026-04-24 20:19:21'),
(5, 2, '2026-04-05 08:30:00', '2026-04-24 21:25:35');

-- Data for table `user_permissions`
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `type`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 9, 'allow', '2026-04-19 12:51:55', '2026-04-19 12:51:55', NULL);

-- Data for table `students`
INSERT INTO `students` (`id`, `lrn`, `first_name`, `middle_name`, `last_name`, `suffix`, `sex`, `birthdate`, `birthplace`, `street_address`, `barangay`, `city_municipality`, `province`, `region`, `status`, `profile_picture`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '87756576', 'Marc Neil', 'Sarabia', 'Dacoylo', NULL, 'male', '2015-11-11', 'Tagbilaran City', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', 'active', '/uploads/images/1780026522714-64c11a25-81a2-437e-a4e2-0524c9144f41-profile-picture.jpg', '2026-04-26 18:18:52', '2026-05-29 11:51:03', NULL);

-- Data for table `student_mother_tongues`
INSERT INTO `student_mother_tongues` (`id`, `student_id`, `mother_tongue_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 2, '2026-05-28 02:12:06', '2026-05-29 11:56:12', NULL);

-- Data for table `student_indigenous_groups`
INSERT INTO `student_indigenous_groups` (`id`, `student_id`, `indigenous_group_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 21, '2026-05-28 02:12:06', '2026-05-29 11:56:12', NULL);

-- Data for table `student_religions`
INSERT INTO `student_religions` (`id`, `student_id`, `religion_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, '2026-05-28 02:12:06', '2026-05-29 11:56:12', NULL);

-- Data for table `student_guardians`
INSERT INTO `student_guardians` (`id`, `student_id`, `guardian_id`, `relationship`, `is_primary`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'Uncle', 1, '2026-05-28 01:48:25', '2026-05-28 01:48:25', NULL);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
