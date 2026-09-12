-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.41 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table esf_db_v2.eligibility_records
DROP TABLE IF EXISTS `eligibility_records`;
CREATE TABLE IF NOT EXISTS `eligibility_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `sf10_record_id` bigint unsigned DEFAULT NULL,
  `credential_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id_text` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pept_rating` decimal(5,2) DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `testing_center` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_credential` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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

-- Dumping data for table esf_db_v2.eligibility_records: ~0 rows (approximately)

-- Dumping structure for table esf_db_v2.email_smtp_settings
DROP TABLE IF EXISTS `email_smtp_settings`;
CREATE TABLE IF NOT EXISTS `email_smtp_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `provider` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gmail',
  `gmail_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gmail_app_password` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `smtp_host` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'smtp.gmail.com',
  `smtp_port` int NOT NULL DEFAULT '587',
  `smtp_secure` tinyint(1) NOT NULL DEFAULT '0',
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.email_smtp_settings: ~0 rows (approximately)
INSERT INTO `email_smtp_settings` (`id`, `provider`, `gmail_email`, `gmail_app_password`, `smtp_host`, `smtp_port`, `smtp_secure`, `is_enabled`, `created_at`, `updated_at`) VALUES
	(1, 'gmail', 'markemildacoylo209@gmail.com', 'zhprbqyzasnsfwal', 'smtp.gmail.com', 587, 0, 1, '2026-05-29 04:55:26', '2026-05-29 04:55:36');

-- Dumping structure for table esf_db_v2.email_templates
DROP TABLE IF EXISTS `email_templates`;
CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `html_content` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_email_templates_key` (`template_key`),
  KEY `idx_email_templates_active` (`template_key`,`is_active`),
  KEY `idx_email_templates_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.email_templates: ~10 rows (approximately)
INSERT INTO `email_templates` (`id`, `template_key`, `template_name`, `subject`, `html_content`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'password_recovery', 'Template  1', 'Password Recovery', '<h1>Password Recovery</h1>\n<p>Hello {{recipientName}},</p>\n<p>Use this link to reset your password: <a href="{{resetLink}}">Reset Password</a></p>\n<p>{{schoolName}}</p>', 0, '2026-05-29 04:41:36', '2026-05-29 04:48:31', '2026-05-29 04:48:31'),
	(2, 'password_recovery', 'Template 1', 'Password Recovery', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Password Recovery</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n  <style>\n    body {\n      margin: 0;\n      padding: 0;\n      background: #f3f4f6;\n      font-family: Arial, sans-serif;\n      color: #111827;\n    }\n\n    .wrapper {\n      width: 100%;\n      min-height: 100vh;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 20px;\n    }\n\n    .card {\n      width: 100%;\n      max-width: 600px;\n      background: #ffffff;\n      border-radius: 12px;\n      overflow: hidden;\n      box-shadow: 0 10px 30px rgba(0,0,0,0.08);\n      border: 1px solid #e5e7eb;\n    }\n\n    .header {\n      background: linear-gradient(135deg, #2563eb, #06b6d4);\n      padding: 28px;\n      text-align: center;\n    }\n\n    .header h1 {\n      margin: 0;\n      font-size: 20px;\n      color: #ffffff;\n      letter-spacing: 1px;\n    }\n\n    .content {\n      padding: 30px;\n      text-align: center;\n    }\n\n    .content h2 {\n      margin-bottom: 10px;\n      font-size: 20px;\n      color: #111827;\n    }\n\n    .content p {\n      font-size: 14px;\n      line-height: 1.6;\n      color: #4b5563;\n    }\n\n    .btn {\n      display: inline-block;\n      margin-top: 20px;\n      padding: 12px 26px;\n      background: #2563eb;\n      color: #ffffff;\n      text-decoration: none;\n      border-radius: 8px;\n      font-weight: bold;\n    }\n\n    .btn:hover {\n      background: #1d4ed8;\n    }\n\n    .link-box {\n      margin-top: 20px;\n      padding: 12px;\n      background: #f9fafb;\n      border: 1px dashed #d1d5db;\n      border-radius: 8px;\n      font-size: 12px;\n      word-break: break-all;\n      color: #2563eb;\n    }\n\n    .warning {\n      margin-top: 20px;\n      font-size: 13px;\n      color: #dc2626;\n    }\n\n    .footer {\n      padding: 18px;\n      text-align: center;\n      font-size: 12px;\n      color: #6b7280;\n      border-top: 1px solid #e5e7eb;\n    }\n  </style>\n</head>\n\n<body>\n\n  <div class="wrapper">\n    <div class="card">\n\n      <div class="header">\n        <h1>{{schoolName}}</h1>\n      </div>\n\n      <div class="content">\n        <h2>Password Reset Request</h2>\n\n        <p>\n          Hello <b>{{recipientName}}</b>,<br>\n          We received a request to reset your password.\n        </p>\n\n        <a class="btn" href="{{resetLink}}">\n          Reset Password\n        </a>\n\n        <p style="margin-top: 25px;">\n          If the button does not work, copy and use this link:\n        </p>\n\n        <div class="link-box">\n          {{resetLink}}\n        </div>\n\n        <p class="warning">\n          If you did not request this, you can safely ignore this email.\n        </p>\n      </div>\n\n      <div class="footer">\n        © 2026 {{schoolName}}. All rights reserved.\n      </div>\n\n    </div>\n  </div>\n\n</body>\n</html>', 0, '2026-05-29 04:54:37', '2026-05-29 05:16:49', '2026-05-29 05:16:49'),
	(3, 'password_recovery', 'Template  Password Recovery', 'Password Recovery', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Temporary Password</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <style>\n    body {\n      margin: 0;\n      padding: 0;\n      background: #f1f5f9;\n      font-family: Arial, sans-serif;\n      color: #0f172a;\n    }\n\n    .wrapper {\n      width: 100%;\n      background: #f1f5f9;\n    }\n\n    .wrapper-cell {\n      padding: 24px;\n      text-align: center;\n    }\n\n    .card {\n      width: 100%;\n      max-width: 600px;\n      margin: 0 auto;\n      background: #ffffff;\n      border-radius: 14px;\n      overflow: hidden;\n      border: 1px solid #e2e8f0;\n      box-shadow: 0 12px 30px rgba(15,23,42,0.12);\n    }\n\n    .header {\n      background: linear-gradient(135deg, #06b6d4, #3b82f6);\n      padding: 30px;\n      text-align: center;\n    }\n\n    .header h1 {\n      margin: 0;\n      font-size: 22px;\n      color: #ffffff;\n      letter-spacing: 1px;\n    }\n\n    .content {\n      padding: 30px;\n      text-align: center;\n    }\n\n    .content h2 {\n      margin-bottom: 10px;\n      font-size: 20px;\n      color: #0f172a;\n    }\n\n    .content p {\n      font-size: 14px;\n      line-height: 1.6;\n      color: #475569;\n    }\n\n    .temporary-password {\n      display: inline-block;\n      margin-top: 20px;\n      padding: 14px 24px;\n      background: #eff6ff;\n      color: #1d4ed8;\n      border: 1px solid #bfdbfe;\n      border-radius: 8px;\n      font-size: 24px;\n      font-weight: bold;\n      letter-spacing: 2px;\n    }\n\n    .warning {\n      margin-top: 20px;\n      font-size: 13px;\n      color: #b91c1c;\n    }\n\n    .footer {\n      padding: 20px;\n      text-align: center;\n      font-size: 12px;\n      color: #64748b;\n      border-top: 1px solid #e2e8f0;\n    }\n  </style>\n</head>\n<body>\n  <table class="wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0">\n    <tr>\n      <td class="wrapper-cell" align="center">\n        <div class="card">\n          <div class="header">\n            <h1>{{schoolName}}</h1>\n          </div>\n          <div class="content">\n            <h2>Temporary Password</h2>\n            <p>Hello {{recipientName}},</p>\n            <p>We received a request to recover your account password.</p>\n            <p>Use this temporary password to sign in:</p>\n            <div class="temporary-password">{{temporaryPassword}}</div>\n            <p class="warning">This temporary password expires in {{expiresIn}}. If it expires, request a new one from the Forgot Password page.</p>\n          </div>\n          <div class="footer">\n            &copy; 2026 {{schoolName}}. All rights reserved.\n          </div>\n        </div>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>', 1, '2026-05-29 05:17:30', '2026-05-29 05:24:12', NULL),
	(4, 'official_notices', 'Template  Official Notices', 'Official Notices', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>{{noticeTitle}}</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <style>\n    body { margin: 0; padding: 24px; background: #f1f5f9; font-family: Arial, sans-serif; color: #0f172a; }\n    .card { max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }\n    .header { padding: 24px; background: #0ea5e9; color: #ffffff; }\n    .content { padding: 24px; line-height: 1.6; }\n    .footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <div class="header">\n      <h1>{{noticeTitle}}</h1>\n      <p>{{schoolName}}</p>\n    </div>\n    <div class="content">\n      {{noticeBody}}\n    </div>\n    <div class="footer">{{schoolEmail}} | {{schoolNumber}}</div>\n  </div>\n</body>\n</html>', 1, '2026-05-29 05:17:58', '2026-05-29 05:19:10', NULL),
	(5, 'otp', 'Template OTP', 'Your One-Time Password', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>One-Time Password</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <style>\n    body { margin: 0; padding: 24px; background: #f1f5f9; font-family: Arial, sans-serif; color: #0f172a; }\n    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 12px 30px rgba(15,23,42,0.12); }\n    h1 { margin-top: 0; color: #0f172a; font-size: 24px; }\n    p { color: #475569; font-size: 14px; line-height: 1.6; }\n    .code { display: inline-block; margin: 20px 0; padding: 14px 22px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; color: #1d4ed8; font-size: 30px; letter-spacing: 8px; font-weight: bold; }\n    .muted { color: #64748b; font-size: 13px; }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>{{schoolName}}</h1>\n    <p>Hello {{recipientName}}, your verification code is:</p>\n    <div class="code">{{otpCode}}</div>\n    <p class="muted">This code expires shortly. Do not share it with anyone.</p>\n  </div>\n</body>\n</html>', 0, '2026-05-29 05:19:53', '2026-05-29 15:00:06', NULL),
	(6, 'otp', 'Template OTP Version 2', 'Your One-Time Password', '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Verification Code</title>\n</head>\n\n<body style="margin:0;padding:0;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;">\n\n<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;padding:40px 0;">\n<tr>\n<td align="center">\n\n<table width="600" cellpadding="0" cellspacing="0" border="0"\nstyle="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">\n\n<tr>\n<td style="background:#2563eb;padding:30px;text-align:center;">\n<h1 style="margin:0;color:#ffffff;font-size:24px;">\n{{schoolName}}\n</h1>\n</td>\n</tr>\n\n<tr>\n<td style="padding:40px;">\n\n<h2 style="margin-top:0;color:#0f172a;">\nVerification Code\n</h2>\n\n<p style="color:#475569;font-size:15px;line-height:1.7;">\nHello <strong>{{recipientName}}</strong>,\n</p>\n\n<p style="color:#475569;font-size:15px;line-height:1.7;">\nUse the following One-Time Password (OTP) to continue your request:\n</p>\n\n<div style="text-align:center;margin:35px 0;">\n<span style="\ndisplay:inline-block;\npadding:18px 30px;\nbackground:#eff6ff;\nborder:2px dashed #2563eb;\nborder-radius:12px;\nfont-size:34px;\nfont-weight:bold;\nletter-spacing:10px;\ncolor:#2563eb;">\n{{otpCode}}\n</span>\n</div>\n\n<p style="color:#475569;font-size:14px;line-height:1.7;">\nThis code will expire in <strong>5 minutes</strong>.\nFor your security, never share this code with anyone.\n</p>\n\n<hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0;">\n\n<p style="font-size:12px;color:#94a3b8;text-align:center;">\nIf you did not request this verification code,\nyou can safely ignore this email.\n</p>\n\n</td>\n</tr>\n\n<tr>\n<td style="background:#f8fafc;padding:20px;text-align:center;">\n<p style="margin:0;font-size:12px;color:#64748b;">\n© {{schoolName}} • Secure Authentication System\n</p>\n</td>\n</tr>\n\n</table>\n\n</td>\n</tr>\n</table>\n\n</body>\n</html>', 0, '2026-05-29 14:44:29', '2026-05-29 14:44:44', NULL),
	(7, 'otp', 'Apple Style OTP', 'One-Time Password', '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Verification Code</title>\n</head>\n\n<body style="\n    margin:0;\n    padding:0;\n    background:#f5f5f7;\n    font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;\n">\n\n<table width="100%" cellpadding="0" cellspacing="0" border="0">\n<tr>\n<td align="center" style="padding:60px 20px;">\n\n<table width="560" cellpadding="0" cellspacing="0" border="0"\nstyle="\n    background:#ffffff;\n    border-radius:24px;\n    overflow:hidden;\n    box-shadow:0 10px 40px rgba(0,0,0,0.08);\n">\n\n<tr>\n<td style="padding:50px 50px 20px 50px;text-align:center;">\n\n<h1 style="\n    margin:0;\n    font-size:30px;\n    font-weight:600;\n    color:#1d1d1f;\n">\n{{schoolName}}\n</h1>\n\n<p style="\n    margin-top:12px;\n    color:#6e6e73;\n    font-size:15px;\n    line-height:1.6;\n">\nSecure Verification\n</p>\n\n</td>\n</tr>\n\n<tr>\n<td style="padding:10px 50px 40px 50px;">\n\n<p style="\n    margin:0 0 20px;\n    color:#1d1d1f;\n    font-size:17px;\n">\nHello {{recipientName}},\n</p>\n\n<p style="\n    margin:0;\n    color:#6e6e73;\n    font-size:15px;\n    line-height:1.8;\n">\nUse the verification code below to complete your sign-in or account verification request.\n</p>\n\n<div style="\n    margin:40px 0;\n    text-align:center;\n">\n\n<div style="\n    display:inline-block;\n    background:#f5f5f7;\n    border-radius:18px;\n    padding:22px 40px;\n">\n\n<span style="\n    font-size:42px;\n    font-weight:700;\n    letter-spacing:12px;\n    color:#1d1d1f;\n">\n{{otpCode}}\n</span>\n\n</div>\n\n</div>\n\n<p style="\n    margin:0;\n    color:#6e6e73;\n    font-size:14px;\n    line-height:1.8;\n">\nThis verification code will expire shortly for your security.\n</p>\n\n<p style="\n    margin-top:12px;\n    color:#6e6e73;\n    font-size:14px;\n    line-height:1.8;\n">\nNever share this code with anyone.\n</p>\n\n</td>\n</tr>\n\n<tr>\n<td style="\n    border-top:1px solid #e5e5e7;\n    padding:25px;\n    text-align:center;\n">\n\n<p style="\n    margin:0;\n    font-size:12px;\n    color:#8e8e93;\n">\nIf you did not request this code, you can safely ignore this email.\n</p>\n\n</td>\n</tr>\n\n</table>\n\n<p style="\n    margin-top:25px;\n    color:#8e8e93;\n    font-size:12px;\n">\n© {{schoolName}}\n</p>\n\n</td>\n</tr>\n</table>\n\n</body>\n</html>', 1, '2026-05-29 14:46:28', '2026-05-29 15:11:04', NULL),
	(8, 'otp', 'Professional School Email OTP Template', 'Professional School Email OTP', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>{{noticeTitle}}</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n  <style>\n    body {\n      margin: 0;\n      padding: 24px;\n      background: #eef2f7;\n      font-family: Arial, sans-serif;\n      color: #0f172a;\n    }\n\n    .container {\n      max-width: 600px;\n      margin: auto;\n    }\n\n    .card {\n      background: #ffffff;\n      border-radius: 12px;\n      padding: 32px;\n      box-shadow: 0 12px 30px rgba(0,0,0,0.08);\n      border-top: 6px solid #1e3a8a;\n    }\n\n    .header {\n      text-align: center;\n      margin-bottom: 20px;\n    }\n\n    .header h1 {\n      margin: 0;\n      font-size: 22px;\n      color: #1e3a8a;\n    }\n\n    .header p {\n      margin: 4px 0;\n      font-size: 13px;\n      color: #475569;\n    }\n\n    .content p {\n      font-size: 14px;\n      color: #334155;\n      line-height: 1.6;\n    }\n\n    .otp-box {\n      margin: 20px auto;\n      display: inline-block;\n      padding: 16px 26px;\n      font-size: 30px;\n      letter-spacing: 6px;\n      font-weight: bold;\n      color: #1e3a8a;\n      background: #eff6ff;\n      border-radius: 10px;\n      border: 1px solid #bfdbfe;\n    }\n\n    .info-box {\n      margin-top: 20px;\n      padding: 14px;\n      background: #f8fafc;\n      border: 1px solid #e2e8f0;\n      border-radius: 8px;\n      font-size: 13px;\n      color: #475569;\n    }\n\n    .footer {\n      margin-top: 20px;\n      text-align: center;\n      font-size: 12px;\n      color: #64748b;\n    }\n\n    .label {\n      font-weight: bold;\n      color: #0f172a;\n    }\n  </style>\n</head>\n\n<body>\n  <div class="container">\n    <div class="card">\n\n      <!-- HEADER -->\n      <div class="header">\n        <h1>{{schoolName}}</h1>\n        <p>{{schoolEmail}} | {{schoolNumber}}</p>\n      </div>\n\n      <!-- CONTENT -->\n      <div class="content">\n        <p>Dear <strong>{{recipientName}}</strong>,</p>\n\n        <p>{{noticeBody}}</p>\n\n        <div style="text-align:center;">\n          <div class="otp-box">{{otpCode}}</div>\n        </div>\n\n        <p><span class="label">Temporary Password:</span> {{temporaryPassword}}</p>\n        <p><span class="label">Expires In:</span> {{expiresIn}}</p>\n\n        <div class="info-box">\n          This is an automated message. If you did not request this, please ignore this email or contact the school administration immediately.\n        </div>\n      </div>\n\n      <!-- FOOTER -->\n      <div class="footer">\n        © {{schoolName}} — All rights reserved\n      </div>\n\n    </div>\n  </div>\n</body>\n</html>', 0, '2026-05-29 14:49:26', '2026-05-29 14:53:43', NULL),
	(9, 'otp', 'Microsoft/Office 365 Style OTP', 'Microsoft/Office 365 Style OTP', '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>{{noticeTitle}}</title>\n</head>\n\n<body style="margin:0;padding:0;background:#f3f2f1;font-family:\'Segoe UI\',Arial,Helvetica,sans-serif;">\n\n<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f2f1;padding:40px 0;">\n<tr>\n<td align="center">\n\n<!-- MAIN CONTAINER -->\n<table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #edebe9;border-radius:6px;overflow:hidden;">\n\n<!-- HEADER -->\n<tr>\n<td style="padding:26px 32px;border-bottom:1px solid #edebe9;background:#ffffff;">\n\n    <div style="font-size:22px;font-weight:600;color:#323130;">\n        {{schoolName}}\n    </div>\n\n    <div style="margin-top:6px;font-size:13px;color:#605e5c;">\n        {{noticeTitle}}\n    </div>\n\n</td>\n</tr>\n\n<!-- BODY -->\n<tr>\n<td style="padding:34px 32px;">\n\n    <p style="margin:0 0 16px;color:#323130;font-size:15px;line-height:1.6;">\n        Hi <strong>{{recipientName}}</strong>,\n    </p>\n\n    <p style="margin:0 0 22px;color:#323130;font-size:15px;line-height:1.6;">\n        {{noticeBody}}\n    </p>\n\n    <!-- OTP BOX -->\n    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0;">\n        <tr>\n            <td style="background:#faf9f8;border-left:4px solid #0078d4;padding:20px 18px;">\n\n                <div style="font-size:12px;color:#605e5c;margin-bottom:8px;">\n                    Security code\n                </div>\n\n                <div style="font-size:38px;font-weight:600;letter-spacing:10px;color:#0078d4;font-family:Consolas,\'Courier New\',monospace;">\n                    {{otpCode}}\n                </div>\n\n            </td>\n        </tr>\n    </table>\n\n    <p style="margin:0 0 12px;color:#323130;font-size:15px;line-height:1.6;">\n        This code will expire in <strong>{{expiresIn}}</strong>.\n    </p>\n\n    <p style="margin:0 0 18px;color:#323130;font-size:15px;line-height:1.6;">\n        If you did not request this code, you can safely ignore this email.\n    </p>\n\n    <!-- OPTIONAL TEMP PASSWORD -->\n    <p style="margin:0;color:#605e5c;font-size:13px;line-height:1.6;">\n        Temporary Password: <strong>{{temporaryPassword}}</strong>\n    </p>\n\n</td>\n</tr>\n\n<!-- FOOTER -->\n<tr>\n<td style="padding:22px 32px;background:#faf9f8;border-top:1px solid #edebe9;">\n\n    <p style="margin:0 0 8px;color:#605e5c;font-size:12px;line-height:1.5;">\n        {{schoolEmail}} • {{schoolNumber}}\n    </p>\n\n    <p style="margin:0;color:#8a8886;font-size:12px;line-height:1.5;">\n        © {{currentYear}} {{schoolName}}. All rights reserved.\n    </p>\n\n</td>\n</tr>\n\n</table>\n\n</td>\n</tr>\n</table>\n\n</body>\n</html>', 0, '2026-05-29 14:50:31', '2026-05-29 14:56:14', NULL),
	(10, 'otp', 'Google Style OTP', 'Google Style OTP', '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>{{noticeTitle}}</title>\n\n<style>\n  body {\n    margin:0;\n    padding:24px;\n    background:#f1f3f4;\n    font-family:Arial,sans-serif;\n  }\n\n  .card {\n    max-width:520px;\n    margin:auto;\n    background:#fff;\n    border-radius:12px;\n    padding:32px;\n    text-align:center;\n    box-shadow:0 4px 18px rgba(0,0,0,0.1);\n  }\n\n  h1 { color:#202124; margin-bottom:5px; }\n  p { color:#5f6368; font-size:14px; }\n\n  .otp {\n    display:inline-block;\n    margin:20px 0;\n    padding:14px 24px;\n    font-size:30px;\n    letter-spacing:6px;\n    font-weight:bold;\n    color:#1a73e8;\n    background:#e8f0fe;\n    border-radius:8px;\n  }\n</style>\n</head>\n\n<body>\n  <div class="card">\n    <h1>{{schoolName}}</h1>\n    <p>{{noticeBody}}</p>\n\n    <div class="otp">{{otpCode}}</div>\n\n    <p>Expires in: {{expiresIn}}</p>\n    <p>Do not share this code.</p>\n  </div>\n</body>\n</html>', 0, '2026-05-29 14:54:39', '2026-05-29 14:54:39', NULL);

-- Dumping structure for table esf_db_v2.enrollments
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `school_year_id` bigint unsigned NOT NULL,
  `section_id` bigint unsigned NOT NULL,
  `admission_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'continuing',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enrolled',
  `enrollment_date` date DEFAULT NULL,
  `completion_status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_applicable',
  `previous_school_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_school_id_text` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_grade_level` tinyint unsigned DEFAULT NULL,
  `transfer_in_date` date DEFAULT NULL,
  `documents_submitted` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enrollments_student_school_year_unique` (`student_id`,`school_year_id`),
  KEY `idx_enrollments_deleted_at` (`deleted_at`),
  KEY `fk_enrollments_school_year` (`school_year_id`),
  KEY `fk_enrollments_section` (`section_id`),
  CONSTRAINT `fk_enrollments_school_year` FOREIGN KEY (`school_year_id`) REFERENCES `school_years` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_enrollments_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_enrollments_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.enrollments: ~11 rows (approximately)
INSERT INTO `enrollments` (`id`, `student_id`, `school_year_id`, `section_id`, `admission_type`, `status`, `enrollment_date`, `completion_status`, `previous_school_name`, `previous_school_id_text`, `previous_grade_level`, `transfer_in_date`, `documents_submitted`, `remarks`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 1, 4, 'continuing', 'enrolled', '2026-06-06', 'not_applicable', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-30 10:36:43', '2026-05-30 11:48:59', NULL),
	(2, 10, 1, 4, 'continuing', 'enrolled', '2026-06-06', 'not_applicable', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-30 11:47:33', '2026-05-30 11:49:05', NULL),
	(3, 2, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, 'Remarks', '2026-05-31 03:34:21', '2026-05-31 03:34:21', NULL),
	(4, 6, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-31 03:37:06', '2026-05-31 03:37:06', NULL),
	(5, 7, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-31 03:37:16', '2026-05-31 03:37:16', NULL),
	(6, 8, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-31 03:37:25', '2026-05-31 03:37:31', NULL),
	(7, 11, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-31 03:37:57', '2026-05-31 03:37:57', NULL),
	(8, 9, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, 'sasd', '2026-05-31 03:38:07', '2026-05-31 03:38:07', NULL),
	(9, 3, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, 'asdasd', '2026-05-31 03:38:17', '2026-05-31 03:38:17', NULL),
	(10, 5, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, 'asdasd', '2026-05-31 03:38:28', '2026-05-31 03:38:28', NULL),
	(11, 4, 1, 5, 'continuing', 'enrolled', '2026-06-01', 'not_applicable', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-31 03:38:39', '2026-05-31 03:38:39', NULL);

-- Dumping structure for table esf_db_v2.guardians
DROP TABLE IF EXISTS `guardians`;
CREATE TABLE IF NOT EXISTS `guardians` (
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.guardians: ~11 rows (approximately)
INSERT INTO `guardians` (`id`, `firstname`, `middlename`, `lastname`, `suffix`, `relationship`, `contact_number`, `address`, `barangay`, `municipality_city`, `province`, `region`, `profile_picture`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Mary Zosineil', 'Sarabia', 'Dacoylo', NULL, 'Uncle', '099999999999', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', '/uploads/images/1780026586260-ecc76c35-6b4c-4239-bf53-df4172c232d9-profile-picture.jpg', '2026-05-27 17:48:25', '2026-05-29 03:49:46', NULL),
	(2, 'Maria', 'Santos', 'Cruz', NULL, 'mother', '09980000001', 'Purok 1', 'Poblacion', 'Trinidad', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(3, 'Jose', 'Reyes', 'Dela Cruz', NULL, 'father', '09980000002', 'Purok 2', 'San Isidro', 'Talibon', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(4, 'Elena', 'Garcia', 'Villanueva', NULL, 'mother', '09980000003', 'Purok 3', 'Fatima', 'Ubay', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(5, 'Roberto', 'Lopez', 'Ramos', NULL, 'father', '09980000004', 'Purok 4', 'Cogon', 'Tagbilaran City', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(6, 'Carmen', 'Mendoza', 'Bautista', NULL, 'guardian', '09980000005', 'Purok 5', 'Campao Occidental', 'Getafe', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(7, 'Daniel', 'Flores', 'Santiago', NULL, 'father', '09980000006', 'Purok 6', 'Anonang', 'Buenavista', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(8, 'Lucia', 'Torres', 'Navarro', NULL, 'mother', '09980000007', 'Purok 7', 'Poblacion Centro', 'Clarin', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(9, 'Ramon', 'Aquino', 'Castillo', NULL, 'guardian', '09980000008', 'Purok 8', 'Dagnawan', 'Sagbayan', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(10, 'Teresa', 'Rivera', 'Morales', NULL, 'mother', '09980000009', 'Purok 9', 'Pooc Occidental', 'Tubigon', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL),
	(11, 'Antonio', 'Fernandez', 'Soriano', NULL, 'father', '09980000010', 'Purok 10', 'Bentig', 'Calape', 'Bohol', 'Region VII - Central Visayas', NULL, '2026-05-30 11:05:54', '2026-05-30 11:05:54', NULL);

-- Dumping structure for table esf_db_v2.indigenous_groups
DROP TABLE IF EXISTS `indigenous_groups`;
CREATE TABLE IF NOT EXISTS `indigenous_groups` (
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
) ENGINE=InnoDB AUTO_INCREMENT=3568 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.indigenous_groups: ~22 rows (approximately)
INSERT INTO `indigenous_groups` (`id`, `name`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Aeta / Agta', 1, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(2, 'Igorot', 2, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(3, 'Ifugao', 3, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(4, 'Bontoc', 4, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(5, 'Kankanaey', 5, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(6, 'Ibaloi', 6, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(7, 'Mangyan', 7, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(8, 'Iraya', 8, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(9, 'Alangan', 9, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(10, 'Tadyawan', 10, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(11, 'Lumad', 11, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(12, 'Manobo', 12, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(13, 'T\'boli', 13, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(14, 'Subanen', 14, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(15, 'B\'laan', 15, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(16, 'Higaonon', 16, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(17, 'Badjao / Sama-Bajau', 17, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(18, 'Tausug (also ethnic group in Sulu)', 18, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(19, 'Maranao', 19, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(20, 'Yakan', 20, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(21, 'Non-IP / Not Applicable', 21, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(22, 'Other', 22, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL);

-- Dumping structure for table esf_db_v2.modules
DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
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

-- Dumping data for table esf_db_v2.modules: ~4 rows (approximately)
INSERT INTO `modules` (`id`, `name`, `slug`, `icon`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Student Management', 'student', 'users', 1, '2026-04-01 01:00:00', '2026-05-27 18:38:52', NULL),
	(2, 'Grades', 'grades', 'chart', 2, '2026-04-01 01:10:00', '2026-04-01 01:10:00', NULL),
	(3, 'Reports', 'reports', 'document', 3, '2026-04-01 01:20:00', '2026-04-01 01:20:00', NULL),
	(4, 'Users', 'user', 'users', 4, '2026-04-01 01:30:00', '2026-04-01 01:30:00', NULL);

-- Dumping structure for table esf_db_v2.mother_tongues
DROP TABLE IF EXISTS `mother_tongues`;
CREATE TABLE IF NOT EXISTS `mother_tongues` (
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
) ENGINE=InnoDB AUTO_INCREMENT=2758 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.mother_tongues: ~17 rows (approximately)
INSERT INTO `mother_tongues` (`id`, `name`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Filipino / Tagalog', 1, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(2, 'Cebuano / Bisaya', 2, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(3, 'Ilocano', 3, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(4, 'Hiligaynon (Ilonggo)', 4, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(5, 'Waray', 5, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(6, 'Kapampangan', 6, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(7, 'Pangasinan', 7, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(8, 'Bikol / Bicolano', 8, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(9, 'Maranao', 9, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(10, 'Maguindanaoan', 10, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(11, 'Tausug', 11, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(12, 'Chavacano', 12, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(13, 'Ivatan', 13, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(14, 'Ifugao', 14, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(15, 'Kankanaey', 15, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(16, 'Ibaloi', 16, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(17, 'N/A', 17, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL);

-- Dumping structure for table esf_db_v2.password_recovery_requests
DROP TABLE IF EXISTS `password_recovery_requests`;
CREATE TABLE IF NOT EXISTS `password_recovery_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recovery_method` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'temporary_password',
  `temporary_password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_code_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_password_recovery_user` (`user_id`),
  KEY `idx_password_recovery_email` (`email`),
  KEY `idx_password_recovery_expires_at` (`expires_at`),
  KEY `idx_password_recovery_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_password_recovery_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.password_recovery_requests: ~6 rows (approximately)
INSERT INTO `password_recovery_requests` (`id`, `user_id`, `email`, `recovery_method`, `temporary_password_hash`, `otp_code_hash`, `expires_at`, `verified_at`, `used_at`, `created_at`, `deleted_at`) VALUES
	(1, 1, 'markemil.dacoylo13@gmail.com', 'temporary_password', '$2b$10$JDdp0RQbBvf/GzqkobbjEufZJ1mC78ff8g1cbBGaHbdh57r5FMRDS', NULL, '2026-05-29 06:39:43', NULL, '2026-05-29 05:41:04', '2026-05-29 05:39:43', '2026-05-29 05:41:04'),
	(2, 2, 'elee39927@gmail.com', 'temporary_password', '$2b$10$NJHRkBQPkM2BRR3ZcwMnLOdpajvcdKoUlbJjgKaCAWxKa4bXjvaBa', NULL, '2026-05-29 07:32:30', NULL, '2026-05-29 06:33:08', '2026-05-29 06:32:30', '2026-05-29 06:33:08'),
	(3, 1, 'markemil.dacoylo13@gmail.com', 'otp_email', NULL, '$2b$10$Yb1tfNa7fXmCoKmZEMsRCuHuTNWPldIIMJXsUX1a3PsUHhL1U5gfG', '2026-05-29 15:11:43', '2026-05-29 15:01:43', '2026-05-29 15:02:01', '2026-05-29 15:00:52', '2026-05-29 15:02:01'),
	(4, 1, 'markemil.dacoylo13@gmail.com', 'otp_email', NULL, '$2b$10$9Ft43htvUqAXmdM84H2x/.hjgdd/bJYcA5U65kgi0d.wvqF.KVdsq', '2026-05-29 15:13:37', NULL, NULL, '2026-05-29 15:11:36', '2026-05-29 15:14:03'),
	(5, 1, 'markemil.dacoylo13@gmail.com', 'otp_email', NULL, '$2b$10$0Qel5X40lwvQLQDiPHibburlXDs/WzW0DbcHO.8E2Heh9O2iMBVKm', '2026-05-29 15:24:29', '2026-05-29 15:14:29', '2026-05-29 15:15:03', '2026-05-29 15:14:03', '2026-05-29 15:15:03'),
	(6, 1, 'markemil.dacoylo13@gmail.com', 'temporary_password', '$2b$10$sN1QlSKo6M8.Htz7mo/RpO189XFytdyPJfV67m/b9wPgKpy1OjNfS', NULL, '2026-05-29 16:15:26', NULL, '2026-05-29 15:16:11', '2026-05-29 15:15:25', '2026-05-29 15:16:11');

-- Dumping structure for table esf_db_v2.permissions
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
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

-- Dumping data for table esf_db_v2.permissions: ~14 rows (approximately)
INSERT INTO `permissions` (`id`, `module_id`, `name`, `slug`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 'View Students', 'student.view', 'Access the student listing and profiles.', '2026-04-01 02:00:00', '2026-05-27 18:38:53', NULL),
	(2, 1, 'Create Student', 'student.create', 'Register a new student record.', '2026-04-01 02:05:00', '2026-05-27 18:38:53', NULL),
	(3, 1, 'Update Student', 'student.update', 'Modify student profile details.', '2026-04-01 02:10:00', '2026-05-27 18:38:53', NULL),
	(4, 2, 'View Grades', 'grades.view', 'Open grade sheets and grade summaries.', '2026-04-01 02:20:00', '2026-04-01 02:20:00', NULL),
	(5, 2, 'Encode Grades', 'grades.encode', 'Input quarterly and final grades.', '2026-04-01 02:25:00', '2026-04-01 02:25:00', NULL),
	(6, 2, 'Publish Grades', 'grades.publish', 'Release grade results to users.', '2026-04-01 02:30:00', '2026-04-01 02:30:00', NULL),
	(7, 3, 'View Reports', 'reports.view', 'Access report listings and details.', '2026-04-01 02:40:00', '2026-04-01 02:40:00', NULL),
	(8, 3, 'Generate Reports', 'reports.generate', 'Generate report output based on filters.', '2026-04-01 02:45:00', '2026-04-01 02:45:00', NULL),
	(9, 3, 'Export Reports', 'reports.export', 'Export reports to file formats.', '2026-04-01 02:50:00', '2026-04-01 02:50:00', NULL),
	(10, 4, 'Can View', 'user.can_view', 'Allow access to the users listing and profile details.', '2026-04-01 03:00:00', '2026-04-01 03:00:00', NULL),
	(11, 4, 'Can Add', 'user.can_add', 'Allow creation of new user accounts.', '2026-04-01 03:05:00', '2026-04-01 03:05:00', NULL),
	(12, 4, 'Can Edit', 'user.can_edit', 'Allow editing of existing user information.', '2026-04-01 03:10:00', '2026-04-01 03:10:00', NULL),
	(13, 4, 'Can Delete', 'user.can_delete', 'Allow deletion of user records.', '2026-04-01 03:15:00', '2026-04-01 03:15:00', NULL),
	(14, 4, 'Can Update Status', 'user.can_update_status', 'Allow updating the active, inactive, or banned status of a user.', '2026-04-01 03:20:00', '2026-04-01 03:20:00', NULL);

-- Dumping structure for table esf_db_v2.positions
DROP TABLE IF EXISTS `positions`;
CREATE TABLE IF NOT EXISTS `positions` (
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

-- Dumping data for table esf_db_v2.positions: ~28 rows (approximately)
INSERT INTO `positions` (`id`, `acronym`, `full_position`, `category`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'T-I', 'Teacher I', 'Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(2, 'T-II', 'Teacher II', 'Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(3, 'T-III', 'Teacher III', 'Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(4, 'MT-I', 'Master Teacher I', 'Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(5, 'MT-II', 'Master Teacher II', 'Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(6, 'SPED-T', 'Special Education Teacher', 'Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(7, 'K-T', 'Kindergarten Teacher', 'Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(8, 'HT-I', 'Head Teacher I', 'School Administration', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(9, 'HT-II', 'Head Teacher II', 'School Administration', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(10, 'HT-III', 'Head Teacher III', 'School Administration', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(11, 'SP-I', 'School Principal I', 'School Administration', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(12, 'SP-II', 'School Principal II', 'School Administration', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(13, 'SP-III', 'School Principal III', 'School Administration', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(14, 'SP-IV', 'School Principal IV', 'School Administration', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(15, 'PSDS', 'Public Schools District Supervisor', 'School Administration', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(16, 'GC', 'Guidance Counselor', 'Support Services', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(17, 'LIB', 'Librarian', 'Support Services', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(18, 'EPS', 'Education Program Specialist', 'Support Services', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(19, 'SN', 'School Nurse', 'Support Services', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(20, 'REG', 'Registrar', 'Support Services', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(21, 'AO-I', 'Administrative Officer I', 'Non-Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(22, 'AO-II', 'Administrative Officer II', 'Non-Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(23, 'AO-III', 'Administrative Officer III', 'Non-Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(24, 'ADAS', 'Administrative Assistant', 'Non-Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(25, 'CLK', 'Clerk', 'Non-Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(26, 'RO', 'Records Officer', 'Non-Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(27, 'CASH', 'Cashier', 'Non-Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL),
	(28, 'UTY', 'Utility Worker', 'Non-Teaching', '2026-04-24 12:34:37', '2026-04-24 12:34:37', NULL);

-- Dumping structure for table esf_db_v2.religions
DROP TABLE IF EXISTS `religions`;
CREATE TABLE IF NOT EXISTS `religions` (
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
) ENGINE=InnoDB AUTO_INCREMENT=2272 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.religions: ~14 rows (approximately)
INSERT INTO `religions` (`id`, `name`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Roman Catholic', 1, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(2, 'Islam', 2, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(3, 'Iglesia ni Cristo', 3, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(4, 'Born Again Christian', 4, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(5, 'Protestant', 5, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(6, 'Seventh-day Adventist', 6, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(7, 'Jehovah\'s Witnesses', 7, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(8, 'Baptist', 8, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(9, 'Evangelical', 9, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(10, 'LDS / Mormon', 10, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(11, 'Hinduism', 11, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(12, 'Buddhism', 12, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(13, 'Other Christian Denominations', 13, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL),
	(14, 'N/A', 14, 1, '2026-05-27 17:56:02', '2026-05-27 17:56:02', NULL);

-- Dumping structure for table esf_db_v2.remedial_classes
DROP TABLE IF EXISTS `remedial_classes`;
CREATE TABLE IF NOT EXISTS `remedial_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `scholastic_record_id` bigint unsigned NOT NULL,
  `subject_id` bigint unsigned NOT NULL,
  `date_from` date DEFAULT NULL,
  `date_to` date DEFAULT NULL,
  `final_rating` decimal(5,2) DEFAULT NULL,
  `remedial_class_mark` decimal(5,2) DEFAULT NULL,
  `recomputed_final_grade` decimal(5,2) DEFAULT NULL,
  `remarks` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

-- Dumping data for table esf_db_v2.remedial_classes: ~0 rows (approximately)

-- Dumping structure for table esf_db_v2.roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
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

-- Dumping data for table esf_db_v2.roles: ~6 rows (approximately)
INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'admin', 'Full access to all modules and configuration.', '2026-04-01 00:00:00', '2026-04-01 00:00:00', NULL),
	(2, 'teacher', 'Can manage student records, grades, and related workflows.', '2026-04-02 00:00:00', '2026-05-27 18:38:53', '2026-04-24 13:25:35'),
	(3, 'staff', 'Handles enrollment, reports, and academic documentation.', '2026-04-03 00:00:00', '2026-04-24 12:24:09', NULL),
	(4, 'developer', 'Full access for development, testing, and system configuration.', '2026-04-04 00:00:00', '2026-04-04 00:00:00', NULL),
	(5, 'sample', 'This sample', '2026-04-19 11:11:28', '2026-04-24 12:24:16', '2026-04-24 12:24:16'),
	(6, 'users', 'This is user role', '2026-04-24 13:26:00', '2026-04-24 13:26:00', NULL);

-- Dumping structure for table esf_db_v2.role_permissions
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
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

-- Dumping data for table esf_db_v2.role_permissions: ~54 rows (approximately)
INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`, `deleted_at`) VALUES
	(1, 1, '2026-04-19 04:51:55', NULL),
	(1, 2, '2026-04-19 04:51:55', NULL),
	(1, 3, '2026-04-19 04:51:55', NULL),
	(1, 4, '2026-04-19 04:51:55', NULL),
	(1, 5, '2026-04-19 04:51:55', NULL),
	(1, 6, '2026-04-19 04:51:55', NULL),
	(1, 7, '2026-04-19 04:51:55', NULL),
	(1, 8, '2026-04-19 04:51:55', NULL),
	(1, 9, '2026-04-19 04:51:55', NULL),
	(1, 10, '2026-04-19 04:51:55', NULL),
	(1, 11, '2026-04-19 04:51:55', NULL),
	(1, 12, '2026-04-19 04:51:55', NULL),
	(1, 13, '2026-04-19 04:51:55', NULL),
	(1, 14, '2026-04-19 04:51:55', NULL),
	(2, 1, '2026-04-19 04:51:55', '2026-04-24 13:25:35'),
	(2, 3, '2026-04-19 04:51:55', '2026-04-24 13:25:35'),
	(2, 4, '2026-04-19 04:51:55', '2026-04-24 13:25:35'),
	(2, 5, '2026-04-19 04:51:55', '2026-04-24 13:25:35'),
	(2, 6, '2026-04-19 04:51:55', '2026-04-24 13:25:35'),
	(2, 7, '2026-04-19 04:51:55', '2026-04-24 13:25:35'),
	(3, 1, '2026-04-19 04:51:55', '2026-04-24 12:19:21'),
	(3, 7, '2026-04-19 04:51:55', '2026-04-24 12:19:21'),
	(3, 8, '2026-04-19 04:51:55', '2026-04-24 12:19:21'),
	(3, 9, '2026-04-19 04:51:55', '2026-04-24 12:19:21'),
	(4, 1, '2026-04-19 04:51:55', NULL),
	(4, 2, '2026-04-19 04:51:55', NULL),
	(4, 3, '2026-04-19 04:51:55', NULL),
	(4, 4, '2026-04-19 04:51:55', NULL),
	(4, 5, '2026-04-19 04:51:55', NULL),
	(4, 6, '2026-04-19 04:51:55', NULL),
	(4, 7, '2026-04-19 04:51:55', NULL),
	(4, 8, '2026-04-19 04:51:55', NULL),
	(4, 9, '2026-04-19 04:51:55', NULL),
	(4, 10, '2026-04-19 04:51:55', NULL),
	(4, 11, '2026-04-19 04:51:55', NULL),
	(4, 12, '2026-04-19 04:51:55', NULL),
	(4, 13, '2026-04-19 04:51:55', NULL),
	(4, 14, '2026-04-19 04:51:55', NULL),
	(5, 10, '2026-04-19 11:11:54', '2026-04-24 12:24:16'),
	(5, 11, '2026-04-19 11:11:54', '2026-04-24 12:24:16'),
	(5, 12, '2026-04-19 11:11:54', '2026-04-24 12:24:16'),
	(5, 13, '2026-04-19 11:11:54', '2026-04-24 12:24:16'),
	(5, 14, '2026-04-19 11:11:54', '2026-04-24 12:24:16'),
	(6, 4, '2026-04-24 13:26:14', NULL),
	(6, 5, '2026-04-24 13:26:14', NULL),
	(6, 6, '2026-04-24 13:26:14', NULL),
	(6, 7, '2026-04-24 13:26:08', NULL),
	(6, 8, '2026-04-24 13:26:08', NULL),
	(6, 9, '2026-04-24 13:26:08', NULL),
	(6, 10, '2026-04-24 13:26:06', '2026-04-26 10:16:12'),
	(6, 11, '2026-04-24 13:26:06', '2026-04-26 10:16:12'),
	(6, 12, '2026-04-24 13:26:06', '2026-04-26 10:16:12'),
	(6, 13, '2026-04-24 13:26:06', '2026-04-26 10:16:12'),
	(6, 14, '2026-04-24 13:26:06', '2026-04-26 10:16:12');

-- Dumping structure for table esf_db_v2.scholastic_records
DROP TABLE IF EXISTS `scholastic_records`;
CREATE TABLE IF NOT EXISTS `scholastic_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sf10_record_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `school_id` bigint unsigned DEFAULT NULL,
  `school_year_id` bigint unsigned NOT NULL,
  `section_id` bigint unsigned DEFAULT NULL,
  `adviser_id` bigint unsigned DEFAULT NULL,
  `grade_level` tinyint unsigned NOT NULL,
  `section_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `division` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `general_average` decimal(5,2) DEFAULT NULL,
  `final_remarks` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

-- Dumping data for table esf_db_v2.scholastic_records: ~0 rows (approximately)

-- Dumping structure for table esf_db_v2.schools
DROP TABLE IF EXISTS `schools`;
CREATE TABLE IF NOT EXISTS `schools` (
  `school_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `deped_school_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `division` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deped_logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`school_id`),
  UNIQUE KEY `schools_deped_school_id_unique` (`deped_school_id`),
  KEY `idx_schools_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.schools: ~0 rows (approximately)
INSERT INTO `schools` (`school_id`, `deped_school_id`, `school_name`, `school_email`, `school_number`, `district`, `division`, `region`, `address`, `school_logo`, `deped_logo`, `other_logo`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, '118768', 'Trinidad Central Elementary School', 'school@gmail.com', '09952788209', 'Trinidad I', 'Bohol', 'Region VII', 'Purok 1, Poblacion, Trinidad, Bohol', '/uploads/images/1780026358756-6197b350-a67f-4a4c-925b-d6a7feda56a4-newlogs.png', '/uploads/images/1780023838255-2ff466e8-127e-4da2-a3bf-399191aaadd5-DepED-Logo.png', '/uploads/images/1780023838263-f0cb3839-4145-4e09-a961-0b1a6aca2844-1280px-Seal_of_the_Department_of_Education_of_the_Philippines.png', '2026-05-29 02:50:45', '2026-05-29 14:21:45', NULL);

-- Dumping structure for table esf_db_v2.school_years
DROP TABLE IF EXISTS `school_years`;
CREATE TABLE IF NOT EXISTS `school_years` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `school_years_name_unique` (`name`),
  KEY `idx_school_years_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.school_years: ~2 rows (approximately)
INSERT INTO `school_years` (`id`, `name`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, '2026-2027', '2026-06-06', '2027-04-07', 1, '2026-05-30 06:54:33', '2026-09-12 10:27:36', NULL),
	(2, '2027-2028', NULL, NULL, 0, '2026-05-31 03:08:51', '2026-09-12 10:27:36', NULL);

-- Dumping structure for table esf_db_v2.sections
DROP TABLE IF EXISTS `sections`;
CREATE TABLE IF NOT EXISTS `sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_year_id` bigint unsigned NOT NULL,
  `grade_level` tinyint unsigned NOT NULL,
  `section_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `adviser_id` bigint unsigned DEFAULT NULL,
  `capacity_limit` smallint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sections_year_grade_name_unique` (`school_year_id`,`grade_level`,`section_name`),
  KEY `idx_sections_deleted_at` (`deleted_at`),
  KEY `fk_sections_adviser` (`adviser_id`),
  CONSTRAINT `fk_sections_adviser` FOREIGN KEY (`adviser_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sections_school_year` FOREIGN KEY (`school_year_id`) REFERENCES `school_years` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.sections: ~4 rows (approximately)
INSERT INTO `sections` (`id`, `school_year_id`, `grade_level`, `section_name`, `adviser_id`, `capacity_limit`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 1, 'Mabini', 2, 35, '2026-05-30 10:21:28', '2026-05-30 12:16:47', NULL),
	(3, 1, 2, 'Rizal', 3, 35, '2026-05-30 11:17:36', '2026-05-30 11:17:36', NULL),
	(4, 1, 3, 'Bonifacio', 4, 35, '2026-05-30 11:17:36', '2026-05-30 11:17:36', NULL),
	(5, 1, 2, 'Prod', 9, 35, '2026-05-31 03:33:37', '2026-05-31 03:33:37', NULL);

-- Dumping structure for table esf_db_v2.sf10_certifications
DROP TABLE IF EXISTS `sf10_certifications`;
CREATE TABLE IF NOT EXISTS `sf10_certifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sf10_record_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `eligible_for_grade` tinyint unsigned DEFAULT NULL,
  `school_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id_text` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `division` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_school_year_attended` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

-- Dumping data for table esf_db_v2.sf10_certifications: ~0 rows (approximately)

-- Dumping structure for table esf_db_v2.sf10_records
DROP TABLE IF EXISTS `sf10_records`;
CREATE TABLE IF NOT EXISTS `sf10_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `school_id` bigint unsigned DEFAULT NULL,
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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

-- Dumping data for table esf_db_v2.sf10_records: ~0 rows (approximately)

-- Dumping structure for table esf_db_v2.students
DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table esf_db_v2.students: ~11 rows (approximately)
INSERT INTO `students` (`id`, `lrn`, `first_name`, `middle_name`, `last_name`, `suffix`, `sex`, `birthdate`, `birthplace`, `street_address`, `barangay`, `city_municipality`, `province`, `region`, `status`, `profile_picture`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, '87756576', 'Marc Neil', 'Sarabia', 'Dacoylo', NULL, 'male', '2015-11-11', 'Tagbilaran City', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', 'active', '/uploads/images/1780026522714-64c11a25-81a2-437e-a4e2-0524c9144f41-profile-picture.jpg', '2026-04-26 10:18:52', '2026-05-29 03:51:03', NULL),
	(2, '200000000001', 'Andrea', 'Santos', 'Cruz', NULL, 'female', '2018-01-15', 'Trinidad, Bohol', 'Purok 1', 'Poblacion', 'Trinidad', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(3, '200000000002', 'Miguel', 'Reyes', 'Dela Cruz', NULL, 'male', '2018-02-22', 'Talibon, Bohol', 'Purok 2', 'San Isidro', 'Talibon', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(4, '200000000003', 'Sophia', 'Garcia', 'Villanueva', NULL, 'female', '2018-03-10', 'Ubay, Bohol', 'Purok 3', 'Fatima', 'Ubay', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(5, '200000000004', 'Nathan', 'Lopez', 'Ramos', NULL, 'male', '2018-04-18', 'Tagbilaran City, Bohol', 'Purok 4', 'Cogon', 'Tagbilaran City', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(6, '200000000005', 'Ella', 'Mendoza', 'Bautista', NULL, 'female', '2018-05-06', 'Getafe, Bohol', 'Purok 5', 'Campao Occidental', 'Getafe', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(7, '200000000006', 'Gabriel', 'Flores', 'Santiago', NULL, 'male', '2018-06-14', 'Buenavista, Bohol', 'Purok 6', 'Anonang', 'Buenavista', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(8, '200000000007', 'Isabella', 'Torres', 'Navarro', NULL, 'female', '2018-07-09', 'Clarin, Bohol', 'Purok 7', 'Poblacion Centro', 'Clarin', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(9, '200000000008', 'Liam', 'Aquino', 'Castillo', NULL, 'male', '2018-08-25', 'Sagbayan, Bohol', 'Purok 8', 'Dagnawan', 'Sagbayan', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(10, '200000000009', 'Alyssa', 'Rivera', 'Morales', NULL, 'female', '2018-09-12', 'Tubigon, Bohol', 'Purok 9', 'Pooc Occidental', 'Tubigon', 'Bohol', 'Region VII - Central Visayas', 'active', NULL, '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(11, '200000000010', 'Joshua', 'Fernandez', 'Soriano', NULL, 'male', '2018-10-30', 'Calape, Bohol', 'Purok 10', 'Bentig', 'Calape', 'Bohol', 'Region VII - Central Visayas', 'active', '/uploads/images/1780141991416-df590370-f97f-489e-b7f5-c4b7d8e702cf-profile-picture.png', '2026-05-30 10:54:59', '2026-05-30 11:53:11', NULL);

-- Dumping structure for table esf_db_v2.student_grades
DROP TABLE IF EXISTS `student_grades`;
CREATE TABLE IF NOT EXISTS `student_grades` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `scholastic_record_id` bigint unsigned NOT NULL,
  `subject_id` bigint unsigned NOT NULL,
  `quarter_1` decimal(5,2) DEFAULT NULL,
  `quarter_2` decimal(5,2) DEFAULT NULL,
  `quarter_3` decimal(5,2) DEFAULT NULL,
  `quarter_4` decimal(5,2) DEFAULT NULL,
  `final_rating` decimal(5,2) DEFAULT NULL,
  `remarks` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

-- Dumping data for table esf_db_v2.student_grades: ~0 rows (approximately)

-- Dumping structure for table esf_db_v2.student_guardians
DROP TABLE IF EXISTS `student_guardians`;
CREATE TABLE IF NOT EXISTS `student_guardians` (
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.student_guardians: ~2 rows (approximately)
INSERT INTO `student_guardians` (`id`, `student_id`, `guardian_id`, `relationship`, `is_primary`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 1, 'Uncle', 1, '2026-05-27 17:48:25', '2026-05-27 17:48:25', NULL),
	(2, 11, 11, 'Father', 1, '2026-05-30 11:14:50', '2026-05-30 11:14:50', NULL);

-- Dumping structure for table esf_db_v2.student_indigenous_groups
DROP TABLE IF EXISTS `student_indigenous_groups`;
CREATE TABLE IF NOT EXISTS `student_indigenous_groups` (
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

-- Dumping data for table esf_db_v2.student_indigenous_groups: ~0 rows (approximately)
INSERT INTO `student_indigenous_groups` (`id`, `student_id`, `indigenous_group_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 21, '2026-05-27 18:12:06', '2026-05-29 03:56:12', NULL);

-- Dumping structure for table esf_db_v2.student_mother_tongues
DROP TABLE IF EXISTS `student_mother_tongues`;
CREATE TABLE IF NOT EXISTS `student_mother_tongues` (
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

-- Dumping data for table esf_db_v2.student_mother_tongues: ~0 rows (approximately)
INSERT INTO `student_mother_tongues` (`id`, `student_id`, `mother_tongue_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 2, '2026-05-27 18:12:06', '2026-05-29 03:56:12', NULL);

-- Dumping structure for table esf_db_v2.student_religions
DROP TABLE IF EXISTS `student_religions`;
CREATE TABLE IF NOT EXISTS `student_religions` (
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

-- Dumping data for table esf_db_v2.student_religions: ~0 rows (approximately)
INSERT INTO `student_religions` (`id`, `student_id`, `religion_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 1, '2026-05-27 18:12:06', '2026-05-29 03:56:12', NULL);

-- Dumping structure for table esf_db_v2.subjects
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_group` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=1262 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.subjects: ~14 rows (approximately)
INSERT INTO `subjects` (`id`, `name`, `subject_group`, `grade_levels`, `is_optional`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Mother Tongue', 'Core', '[1, 2, 3]', 0, 1, 1, '2026-05-30 05:05:38', '2026-05-30 05:17:28', NULL),
	(2, 'Filipino', 'Core', '[1, 2, 3, 4, 5, 6]', 0, 2, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(3, 'English', 'Core', '[1, 2, 3, 4, 5, 6]', 0, 3, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(4, 'Mathematics', 'Core', '[1, 2, 3, 4, 5, 6]', 0, 4, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(5, 'Science', 'Core', '[1, 2, 3, 4, 5, 6]', 0, 5, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(6, 'Araling Panlipunan', 'Core', '[1, 2, 3, 4, 5, 6]', 0, 6, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(7, 'EPP', 'EPP / TLE', '[4, 5, 6]', 0, 7, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(8, 'Music', 'MAPEH', '[1, 2, 3, 4, 5, 6]', 0, 8, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(9, 'Arts', 'MAPEH', '[1, 2, 3, 4, 5, 6]', 0, 9, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(10, 'Physical Education', 'MAPEH', '[1, 2, 3, 4, 5, 6]', 0, 10, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(11, 'Health', 'MAPEH', '[1, 2, 3, 4, 5, 6]', 0, 11, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(12, 'Edukasyon sa Pagpapakatao', 'Core', '[1, 2, 3, 4, 5, 6]', 0, 12, 1, '2026-05-30 05:05:38', '2026-05-30 05:05:38', NULL),
	(13, 'Arabic Language', 'ALIVE Program', '[1, 2, 3, 4, 5, 6]', 1, 13, 1, '2026-05-30 05:05:38', '2026-05-30 05:50:30', NULL),
	(14, 'Islamic Values Education', 'ALIVE Program', '[1, 2, 3, 4, 5, 6]', 1, 14, 1, '2026-05-30 05:05:38', '2026-05-30 05:50:30', NULL);

-- Dumping structure for table esf_db_v2.system_settings
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE IF NOT EXISTS `system_settings` (
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.system_settings: ~2 rows (approximately)
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES
	('active_principal_user_id', '6', '2026-05-31 04:09:58', '2026-05-31 04:09:58'),
	('forgot_password_method', 'otp_email', '2026-05-29 14:35:05', '2026-05-30 03:55:28');

-- Dumping structure for table esf_db_v2.teachers
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `teachers_user_id_unique` (`user_id`),
  KEY `idx_teachers_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_teachers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.teachers: ~5 rows (approximately)
INSERT INTO `teachers` (`id`, `user_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 6, '2026-05-30 07:09:26', '2026-05-31 03:59:45', NULL),
	(2, 8, '2026-05-30 11:17:36', '2026-05-30 12:54:46', NULL),
	(3, 9, '2026-05-30 11:17:36', '2026-05-30 11:17:36', NULL),
	(4, 10, '2026-05-30 11:17:36', '2026-05-30 11:17:36', NULL),
	(9, 1, '2026-05-31 03:29:37', '2026-05-31 04:00:08', NULL);

-- Dumping structure for table esf_db_v2.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table esf_db_v2.users: ~10 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `contact_number`, `address`, `barangay`, `municipality_city`, `province`, `region`, `username`, `roles`, `position`, `status`, `profile_picture`, `password_hash`, `first_name`, `middle_name`, `last_name`, `suffix`, `sex`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Mark Emil Cajes Dacoylo', 'markemil.dacoylo13@gmail.com', '09952788209', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', 'dacs1993', '["admin", "developer"]', 'Teacher III', 'active', '/uploads/images/1780027050609-7729f807-cc79-4229-a746-188359f96f43-profile-picture.jpg', '$2b$10$h/OBbq0OodeJ/YXyDOsE8e1m//RG8Oznq6i2ciI1K7UbZ05aZ/o0C', 'Mark Emil', 'Cajes', 'Dacoylo', NULL, 'male', '2026-04-18 10:23:37', '2026-05-31 03:29:18', NULL),
	(2, 'Mark2 Dacoylo2', 'elee39927@gmail.com', '09952788209', 'Purok 7', 'Balintawak', 'Talibon', 'Bohol', 'Region VII', 'markdacs', '["admin", "developer"]', 'Administrative Officer III', 'active', '/uploads/images/1780036428730-5c281f3f-efc1-4671-9875-ce99bf480077-profile-picture.jpg', '$2b$10$itDgEPS5Eh8pCLoYiIaaSujNjS5hv732.zSJL5MHh58w8fMS6ltTG', 'Mark2', NULL, 'Dacoylo2', NULL, 'male', '2026-04-18 23:12:40', '2026-05-30 04:19:39', NULL),
	(3, 'Upload Guard', 'upload.auth.20260419105449@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '["user"]', NULL, 'inactive', NULL, '$2b$10$34faAx6lyyQWlQXRHSWWJer8hUCP3Tr4hKTXhz3ieREE7iae71nhi', 'Upload', NULL, 'Guard', NULL, NULL, '2026-04-19 02:54:49', '2026-04-19 11:10:48', '2026-04-19 11:10:48'),
	(4, 'Upload File', 'upload.fileauth.20260419105511@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '["user"]', NULL, 'inactive', NULL, '$2b$10$K1YtE/9W.bQbZVfoBR.AmuHDng9Y1M3OU4Lyp2I3Gs6dqkqAF5cBy', 'Upload', NULL, 'File', NULL, NULL, '2026-04-19 02:55:12', '2026-04-19 11:10:45', '2026-04-19 11:10:45'),
	(5, 'Upload File', 'upload.fileauth2.20260419105532@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '["user"]', NULL, 'inactive', NULL, '$2b$10$grQS3jDaQavqg/YJtu1UAeRzasV3rKodJyhN9BYosx36aXKY2xPqW', 'Upload', NULL, 'File', NULL, 'male', '2026-04-19 02:55:32', '2026-04-19 11:10:38', '2026-04-19 11:10:38'),
	(6, 'Emil Dacoy', 'markemildacoylo209@gmail.com', '09952788209', 'Purok 2', 'Tagum Norte', 'Trinidad', 'Bohol', 'Region VII', 'emil.dacoylo', '["admin", "developer"]', 'School Principal I', 'active', '/uploads/images/1780114388785-1d6ad011-8482-46cd-a085-c8bc64edbc2e-profile-picture.png', '$2b$10$bA0/zDO9F6THIxQM3MHrSetpL2i2yQEmIxCITcMVWuNyyfpaEL6IW', 'Emil', NULL, 'Dacoy', NULL, 'male', '2026-04-24 13:24:40', '2026-05-30 04:13:48', NULL),
	(7, 'Em f Dacoylo', 'emil12@gmail.com', '09952788209', 'purok 2', 'Guinobatan', 'Trinidad', 'Bohol', 'Region VII', 'sampl.em', '["developer", "staff", "admin"]', 'Teacher III', 'active', '/uploads/images/1780114358202-c4f65d44-c13b-40f7-8c05-822e0cb2e9ff-profile-picture.jpg', '$2b$10$AlZuwl5bdTWwL/bDZeJ/QuxuCM3eu.ng3N2CH5b3cUPj8yDjkvVVG', 'Em', 'f', 'Dacoylo', NULL, 'male', '2026-04-26 06:13:00', '2026-05-30 04:12:38', NULL),
	(8, 'Clara Santos Montero', 'teacher3.montero@esf10.test', '09170000001', 'Purok 1', 'Poblacion', 'Trinidad', 'Bohol', 'Region VII - Central Visayas', 'teacher3.montero', '["teacher"]', 'Teacher III', 'active', NULL, '$2b$10$qJBT.Avu8gALv.9v9VQMy.GouQG.R7C41QdYsGqX2.Vguj3zYKOjS', 'Clara', 'Santos', 'Montero', NULL, 'female', '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(9, 'Rogelio Diaz Mercado', 'teacher3.mercado@esf10.test', '09170000002', 'Purok 2', 'San Isidro', 'Talibon', 'Bohol', 'Region VII - Central Visayas', 'teacher3.mercado', '["teacher"]', 'Teacher III', 'active', NULL, '$2b$10$qJBT.Avu8gALv.9v9VQMy.GouQG.R7C41QdYsGqX2.Vguj3zYKOjS', 'Rogelio', 'Diaz', 'Mercado', NULL, 'male', '2026-05-30 10:54:59', '2026-05-30 10:54:59', NULL),
	(10, 'Marianne Cruz Villamor', 'teacher3.villamor@esf10.test', '09170000003', 'Purok 3', 'Fatima', 'Ubay', 'Bohol', 'Region VII - Central Visayas', 'teacher3.villamor', '["teacher"]', 'Teacher I', 'active', NULL, '$2b$10$qJBT.Avu8gALv.9v9VQMy.GouQG.R7C41QdYsGqX2.Vguj3zYKOjS', 'Marianne', 'Cruz', 'Villamor', NULL, 'female', '2026-05-30 10:54:59', '2026-05-30 11:55:16', NULL);

-- Dumping structure for table esf_db_v2.user_permissions
DROP TABLE IF EXISTS `user_permissions`;
CREATE TABLE IF NOT EXISTS `user_permissions` (
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

-- Dumping data for table esf_db_v2.user_permissions: ~0 rows (approximately)
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `type`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(2, 9, 'allow', '2026-04-19 04:51:55', '2026-04-19 04:51:55', NULL);

-- Dumping structure for table esf_db_v2.user_roles
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
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

-- Dumping data for table esf_db_v2.user_roles: ~4 rows (approximately)
INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `deleted_at`) VALUES
	(1, 1, '2026-04-05 00:00:00', NULL),
	(2, 2, '2026-04-05 00:10:00', '2026-04-24 13:25:35'),
	(4, 3, '2026-04-05 00:20:00', '2026-04-24 12:19:21'),
	(5, 2, '2026-04-05 00:30:00', '2026-04-24 13:25:35');

-- Dumping structure for view esf_db_v2.vw_student_guardians
DROP VIEW IF EXISTS `vw_student_guardians`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `vw_student_guardians` (
	`id` BIGINT UNSIGNED NOT NULL,
	`studentId` BIGINT UNSIGNED NOT NULL,
	`guardianId` BIGINT UNSIGNED NOT NULL,
	`relationship` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`isPrimary` TINYINT(1) NULL,
	`createdAt` TIMESTAMP NULL,
	`updatedAt` TIMESTAMP NULL,
	`deletedAt` TIMESTAMP NULL,
	`guardianFirstName` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianMiddleName` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianLastName` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianSuffix` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianRelationship` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianContactNumber` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianAddress` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianBarangay` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianMunicipalityCity` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianProvince` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianRegion` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianProfilePicture` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`guardianCreatedAt` TIMESTAMP NULL,
	`guardianUpdatedAt` TIMESTAMP NULL,
	`guardianDeletedAt` TIMESTAMP NULL,
	`studentLrn` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`studentFirstName` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`studentMiddleName` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`studentLastName` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`studentSuffix` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view esf_db_v2.vw_student_information
DROP VIEW IF EXISTS `vw_student_information`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `vw_student_information` (
	`studentId` BIGINT UNSIGNED NOT NULL,
	`studentLrn` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`motherTongueId` BIGINT UNSIGNED NULL,
	`motherTongueName` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`motherTongueSortOrder` INT NULL,
	`motherTongueIsActive` TINYINT(1) NULL,
	`indigenousGroupId` BIGINT UNSIGNED NULL,
	`indigenousGroupName` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`indigenousGroupSortOrder` INT NULL,
	`indigenousGroupIsActive` TINYINT(1) NULL,
	`religionId` BIGINT UNSIGNED NULL,
	`religionName` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`religionSortOrder` INT NULL,
	`religionIsActive` TINYINT(1) NULL
) ENGINE=MyISAM;

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `vw_student_guardians`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_student_guardians` AS select `pg`.`id` AS `id`,`pg`.`student_id` AS `studentId`,`pg`.`guardian_id` AS `guardianId`,`pg`.`relationship` AS `relationship`,`pg`.`is_primary` AS `isPrimary`,`pg`.`created_at` AS `createdAt`,`pg`.`updated_at` AS `updatedAt`,`pg`.`deleted_at` AS `deletedAt`,`g`.`firstname` AS `guardianFirstName`,`g`.`middlename` AS `guardianMiddleName`,`g`.`lastname` AS `guardianLastName`,`g`.`suffix` AS `guardianSuffix`,`g`.`relationship` AS `guardianRelationship`,`g`.`contact_number` AS `guardianContactNumber`,`g`.`address` AS `guardianAddress`,`g`.`barangay` AS `guardianBarangay`,`g`.`municipality_city` AS `guardianMunicipalityCity`,`g`.`province` AS `guardianProvince`,`g`.`region` AS `guardianRegion`,`g`.`profile_picture` AS `guardianProfilePicture`,`g`.`created_at` AS `guardianCreatedAt`,`g`.`updated_at` AS `guardianUpdatedAt`,`g`.`deleted_at` AS `guardianDeletedAt`,`p`.`lrn` AS `studentLrn`,`p`.`first_name` AS `studentFirstName`,`p`.`middle_name` AS `studentMiddleName`,`p`.`last_name` AS `studentLastName`,`p`.`suffix` AS `studentSuffix` from ((`student_guardians` `pg` join `guardians` `g` on((`g`.`id` = `pg`.`guardian_id`))) join `students` `p` on((`p`.`id` = `pg`.`student_id`))) where ((`pg`.`deleted_at` is null) and (`g`.`deleted_at` is null) and (`p`.`deleted_at` is null));

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `vw_student_information`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_student_information` AS select `p`.`id` AS `studentId`,`p`.`lrn` AS `studentLrn`,`mt`.`id` AS `motherTongueId`,`mt`.`name` AS `motherTongueName`,`mt`.`sort_order` AS `motherTongueSortOrder`,`mt`.`is_active` AS `motherTongueIsActive`,`ig`.`id` AS `indigenousGroupId`,`ig`.`name` AS `indigenousGroupName`,`ig`.`sort_order` AS `indigenousGroupSortOrder`,`ig`.`is_active` AS `indigenousGroupIsActive`,`r`.`id` AS `religionId`,`r`.`name` AS `religionName`,`r`.`sort_order` AS `religionSortOrder`,`r`.`is_active` AS `religionIsActive` from ((((((`students` `p` left join `student_mother_tongues` `pmt` on(((`pmt`.`student_id` = `p`.`id`) and (`pmt`.`deleted_at` is null)))) left join `mother_tongues` `mt` on(((`mt`.`id` = `pmt`.`mother_tongue_id`) and (`mt`.`deleted_at` is null)))) left join `student_indigenous_groups` `pig` on(((`pig`.`student_id` = `p`.`id`) and (`pig`.`deleted_at` is null)))) left join `indigenous_groups` `ig` on(((`ig`.`id` = `pig`.`indigenous_group_id`) and (`ig`.`deleted_at` is null)))) left join `student_religions` `pr` on(((`pr`.`student_id` = `p`.`id`) and (`pr`.`deleted_at` is null)))) left join `religions` `r` on(((`r`.`id` = `pr`.`religion_id`) and (`r`.`deleted_at` is null)))) where (`p`.`deleted_at` is null);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
