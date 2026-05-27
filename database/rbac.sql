-- RBAC schema and seed data with soft delete support
-- This script is designed for MySQL 8+ and is safe to re-run.

CREATE TABLE IF NOT EXISTS modules (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  icon VARCHAR(100) NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY modules_slug_unique (slug),
  KEY idx_modules_sort_order (sort_order),
  KEY idx_modules_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  module_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY permissions_slug_unique (slug),
  KEY idx_permissions_module_id (module_id),
  KEY idx_permissions_deleted_at (deleted_at),
  CONSTRAINT fk_permissions_module_id
    FOREIGN KEY (module_id) REFERENCES modules (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY roles_name_unique (name),
  KEY idx_roles_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (role_id, permission_id),
  KEY idx_role_permissions_permission_id (permission_id),
  KEY idx_role_permissions_deleted_at (deleted_at),
  CONSTRAINT fk_role_permissions_role_id
    FOREIGN KEY (role_id) REFERENCES roles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_role_permissions_permission_id
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_permissions (
  user_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  type ENUM('allow', 'deny') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (user_id, permission_id),
  KEY idx_user_permissions_permission_id (permission_id),
  KEY idx_user_permissions_deleted_at (deleted_at),
  CONSTRAINT fk_user_permissions_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_permissions_permission_id
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (user_id, role_id),
  KEY idx_user_roles_role_id (role_id),
  KEY idx_user_roles_deleted_at (deleted_at),
  CONSTRAINT fk_user_roles_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_roles_role_id
    FOREIGN KEY (role_id) REFERENCES roles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO modules (id, name, slug, icon, sort_order, created_at, updated_at, deleted_at)
VALUES
  (1, 'Student Management', 'student', 'users', 1, '2026-04-01 09:00:00', '2026-04-01 09:00:00', NULL),
  (2, 'Grades', 'grades', 'chart', 2, '2026-04-01 09:10:00', '2026-04-01 09:10:00', NULL),
  (3, 'Reports', 'reports', 'document', 3, '2026-04-01 09:20:00', '2026-04-01 09:20:00', NULL),
  (4, 'Users', 'user', 'users', 4, '2026-04-01 09:30:00', '2026-04-01 09:30:00', NULL)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  icon = VALUES(icon),
  sort_order = VALUES(sort_order),
  deleted_at = NULL,
  updated_at = VALUES(updated_at);

INSERT INTO permissions (id, module_id, name, slug, description, created_at, updated_at, deleted_at)
VALUES
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
  (14, 4, 'Can Update Status', 'user.can_update_status', 'Allow updating the active, inactive, or banned status of a user.', '2026-04-01 11:20:00', '2026-04-01 11:20:00', NULL)
ON DUPLICATE KEY UPDATE
  module_id = VALUES(module_id),
  name = VALUES(name),
  description = VALUES(description),
  deleted_at = NULL,
  updated_at = VALUES(updated_at);

INSERT INTO roles (id, name, description, created_at, updated_at, deleted_at)
VALUES
  (1, 'admin', 'Full access to all modules and configuration.', '2026-04-01 08:00:00', '2026-04-01 08:00:00', NULL),
  (2, 'teacher', 'Can manage student records, grades, and related workflows.', '2026-04-02 08:00:00', '2026-04-02 08:00:00', NULL),
  (3, 'staff', 'Handles enrollment, reports, and academic documentation.', '2026-04-03 08:00:00', '2026-04-03 08:00:00', NULL),
  (4, 'developer', 'Full access for development, testing, and system configuration.', '2026-04-04 08:00:00', '2026-04-04 08:00:00', NULL)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  deleted_at = NULL,
  updated_at = VALUES(updated_at);

INSERT INTO role_permissions (role_id, permission_id, deleted_at)
VALUES
  (1, 1, NULL), (1, 2, NULL), (1, 3, NULL), (1, 4, NULL), (1, 5, NULL), (1, 6, NULL), (1, 7, NULL),
  (1, 8, NULL), (1, 9, NULL), (1, 10, NULL), (1, 11, NULL), (1, 12, NULL), (1, 13, NULL), (1, 14, NULL),
  (2, 1, NULL), (2, 3, NULL), (2, 4, NULL), (2, 5, NULL), (2, 6, NULL), (2, 7, NULL),
  (3, 1, NULL), (3, 7, NULL), (3, 8, NULL), (3, 9, NULL),
  (4, 1, NULL), (4, 2, NULL), (4, 3, NULL), (4, 4, NULL), (4, 5, NULL), (4, 6, NULL), (4, 7, NULL),
  (4, 8, NULL), (4, 9, NULL), (4, 10, NULL), (4, 11, NULL), (4, 12, NULL), (4, 13, NULL), (4, 14, NULL)
ON DUPLICATE KEY UPDATE
  deleted_at = NULL;

INSERT INTO user_permissions (user_id, permission_id, type, deleted_at)
SELECT 2, 9, 'allow', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 2 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  type = VALUES(type),
  deleted_at = NULL,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO user_permissions (user_id, permission_id, type, deleted_at)
SELECT 8, 5, 'deny', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 8 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  type = VALUES(type),
  deleted_at = NULL,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO user_roles (user_id, role_id, assigned_at, deleted_at)
SELECT 1, 1, '2026-04-05 08:00:00', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  assigned_at = VALUES(assigned_at),
  deleted_at = NULL;

INSERT INTO user_roles (user_id, role_id, assigned_at, deleted_at)
SELECT 2, 2, '2026-04-05 08:10:00', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 2 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  assigned_at = VALUES(assigned_at),
  deleted_at = NULL;

INSERT INTO user_roles (user_id, role_id, assigned_at, deleted_at)
SELECT 4, 3, '2026-04-05 08:20:00', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 4 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  assigned_at = VALUES(assigned_at),
  deleted_at = NULL;

INSERT INTO user_roles (user_id, role_id, assigned_at, deleted_at)
SELECT 5, 2, '2026-04-05 08:30:00', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 5 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  assigned_at = VALUES(assigned_at),
  deleted_at = NULL;

INSERT INTO user_roles (user_id, role_id, assigned_at, deleted_at)
SELECT 7, 3, '2026-04-05 08:40:00', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 7 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  assigned_at = VALUES(assigned_at),
  deleted_at = NULL;

INSERT INTO user_roles (user_id, role_id, assigned_at, deleted_at)
SELECT 8, 4, '2026-04-05 08:50:00', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 8 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  assigned_at = VALUES(assigned_at),
  deleted_at = NULL;

INSERT INTO user_roles (user_id, role_id, assigned_at, deleted_at)
SELECT 10, 1, '2026-04-05 09:00:00', NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 10 AND deleted_at IS NULL)
ON DUPLICATE KEY UPDATE
  assigned_at = VALUES(assigned_at),
  deleted_at = NULL;

-- Sample queries you can use after import
-- 1. List all roles with their permissions
-- SELECT r.name AS role_name, p.slug AS permission_slug
-- FROM roles r
-- INNER JOIN role_permissions rp ON rp.role_id = r.id
-- INNER JOIN permissions p ON p.id = rp.permission_id
-- WHERE r.deleted_at IS NULL
--   AND rp.deleted_at IS NULL
--   AND p.deleted_at IS NULL
-- ORDER BY r.name, p.slug;
--
-- 2. List user roles
-- SELECT u.id, u.email, r.name AS role_name
-- FROM user_roles ur
-- INNER JOIN users u ON u.id = ur.user_id
-- INNER JOIN roles r ON r.id = ur.role_id
-- WHERE u.deleted_at IS NULL
--   AND ur.deleted_at IS NULL
--   AND r.deleted_at IS NULL
-- ORDER BY u.id, r.name;
