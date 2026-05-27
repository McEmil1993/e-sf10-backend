-- E-SF10 MySQL Backup
-- Format: mysql-sql-v1
-- Exported At: 2026-04-27T02:56:15.583Z
-- Source Database: esf_db_v2

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

DELETE FROM `user_permissions`;
DELETE FROM `user_roles`;
DELETE FROM `role_permissions`;
DELETE FROM `permissions`;
DELETE FROM `roles`;
DELETE FROM `modules`;
DELETE FROM `students`;
DELETE FROM `positions`;
DELETE FROM `users`;

-- Data for table `modules`
INSERT INTO `modules` (`id`, `name`, `slug`, `icon`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Student Management', 'student', 'users', 1, '2026-04-01 09:00:00', '2026-04-01 09:00:00', NULL),
(2, 'Grades', 'grades', 'chart', 2, '2026-04-01 09:10:00', '2026-04-01 09:10:00', NULL),
(3, 'Reports', 'reports', 'document', 3, '2026-04-01 09:20:00', '2026-04-01 09:20:00', NULL),
(4, 'Users', 'user', 'users', 4, '2026-04-01 09:30:00', '2026-04-01 09:30:00', NULL);

-- Data for table `permissions`
INSERT INTO `permissions` (`id`, `module_id`, `name`, `slug`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'View Students', 'student.view', 'Access the student listing and profiles.', '2026-04-01 10:00:00', '2026-04-01 10:00:00', NULL),
(2, 1, 'Create Student', 'student.create', 'Register a new student record.', '2026-04-01 10:05:00', '2026-04-01 10:05:00', NULL),
(3, 1, 'Update Student', 'student.update', 'Modify student profile details.', '2026-04-01 10:10:00', '2026-04-01 10:10:00', NULL),
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
(2, 'teacher', 'Can manage student records, grades, and related workflows.', '2026-04-02 08:00:00', '2026-04-24 21:25:35', '2026-04-24 21:25:35'),
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

-- Data for table `users`
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `first_name`, `middle_name`, `last_name`, `suffix`, `sex`, `contact_number`, `address`, `barangay`, `municipality_city`, `province`, `region`, `username`, `roles`, `position`, `status`, `profile_picture`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Mark Emil Cajes Dacoylo', 'mark@example.com', '$2b$10$G2rkHpaE3JBGqNiy1PNbPO8P02c66ZkxSavWfXMHTsXXiN/DaDXFy', 'Mark Emil', 'Cajes', 'Dacoylo', NULL, 'male', '09952788209', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', 'dacs1993', '[\"admin\",\"developer\"]', 'Administrative Assistant', 'active', '/uploads/images/1777177882502-8e4a6c08-9873-4e01-b40a-fad2177f15de-profile-picture.jpg', '2026-04-18 18:23:37', '2026-04-26 12:45:00', NULL),
(2, 'Mark2 Dacoylo2', 'mark2@example.com', '$2b$10$.MpC90qT7P.yMSwWVgaA9OXIn8qnhYiXPMMmh8iueA8n.mElApIiC', 'Mark2', NULL, 'Dacoylo2', NULL, 'male', '09952788209', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', NULL, '[\"admin\",\"developer\"]', NULL, 'active', '/uploads/images/1776601922216-63003a41-f607-415f-b2c2-eb3f2a4f7805-profile-picture.jpg', '2026-04-19 07:12:40', '2026-04-24 20:24:38', NULL),
(3, 'Upload Guard', 'upload.auth.20260419105449@example.com', '$2b$10$34faAx6lyyQWlQXRHSWWJer8hUCP3Tr4hKTXhz3ieREE7iae71nhi', 'Upload', NULL, 'Guard', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"user\"]', NULL, 'inactive', NULL, '2026-04-19 10:54:49', '2026-04-19 19:10:48', '2026-04-19 19:10:48'),
(4, 'Upload File', 'upload.fileauth.20260419105511@example.com', '$2b$10$K1YtE/9W.bQbZVfoBR.AmuHDng9Y1M3OU4Lyp2I3Gs6dqkqAF5cBy', 'Upload', NULL, 'File', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"user\"]', NULL, 'inactive', NULL, '2026-04-19 10:55:12', '2026-04-19 19:10:45', '2026-04-19 19:10:45'),
(5, 'Upload File', 'upload.fileauth2.20260419105532@example.com', '$2b$10$grQS3jDaQavqg/YJtu1UAeRzasV3rKodJyhN9BYosx36aXKY2xPqW', 'Upload', NULL, 'File', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"user\"]', NULL, 'inactive', NULL, '2026-04-19 10:55:32', '2026-04-19 19:10:38', '2026-04-19 19:10:38'),
(6, 'Emil Dacoy', 'markemildacoylo209@gmail.com', '$2b$10$bA0/zDO9F6THIxQM3MHrSetpL2i2yQEmIxCITcMVWuNyyfpaEL6IW', 'Emil', NULL, 'Dacoy', NULL, 'male', '09952788209', 'Purok 7', 'Adams (Pob.)', 'Adams', 'Ilocos Norte', 'Region I', 'emil.dacoylo', '[\"admin\",\"developer\"]', 'School Principal I', 'active', '/uploads/images/1777037119046-30075feb-a498-421d-abcd-0c0200386367-profile-picture.jpg', '2026-04-24 21:24:40', '2026-04-24 21:25:23', NULL),
(7, 'Em f Dacoylo', 'emil12@gmail.com', '$2b$10$AlZuwl5bdTWwL/bDZeJ/QuxuCM3eu.ng3N2CH5b3cUPj8yDjkvVVG', 'Em', 'f', 'Dacoylo', NULL, 'male', '09952788209', 'purok 2', 'Guinobatan', 'Trinidad', 'Bohol', 'Region VII', 'sampl.em', '[\"developer\",\"staff\",\"admin\"]', 'Teacher III', 'active', '/uploads/images/1777183980664-0f6858ce-d6e8-4ca6-86e5-6d3e7ad50599-profile-picture.jpg', '2026-04-26 14:13:00', '2026-04-26 14:14:26', NULL);

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
INSERT INTO `students` (`id`, `lrn`, `first_name`, `middle_name`, `last_name`, `suffix`, `sex`, `birthdate`, `birthplace`, `street_address`, `barangay`, `city_municipality`, `province`, `region`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '87756576', 'Samoke', 's', 'De la cruz', NULL, 'male', '2026-04-26', 'Sample', 'Purok 6', 'Guinobatan', 'Trinidad', 'Bohol', 'Region VII', 'active', '2026-04-26 18:18:52', '2026-04-26 18:18:52', NULL);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
