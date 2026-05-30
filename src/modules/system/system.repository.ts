import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";
import type {
  EmailSmtpSettingsRecord,
  EmailSmtpSettingsRow,
  EmailTemplateKey,
  EmailTemplateRecord,
  EmailTemplateRow,
  ForgotPasswordMethod,
  SchoolRecord,
  SchoolRow,
  UpdateEmailSmtpSettingsInput,
  UpdateSchoolInput,
  UpsertEmailTemplateDto,
} from "./system.interface";

const baseSchoolSelect = `
  SELECT
    school_id AS schoolId,
    deped_school_id AS depedSchoolId,
    school_name AS schoolName,
    school_email AS schoolEmail,
    school_number AS schoolNumber,
    district,
    division,
    region,
    address,
    school_logo AS schoolLogo,
    deped_logo AS depedLogo,
    other_logo AS otherLogo,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM schools
`;

const mapSchool = (row: SchoolRow): SchoolRecord => {
  return {
    schoolId: row.schoolId,
    depedSchoolId: row.depedSchoolId,
    schoolName: row.schoolName,
    schoolEmail: row.schoolEmail,
    schoolNumber: row.schoolNumber,
    district: row.district,
    division: row.division,
    region: row.region,
    address: row.address,
    schoolLogo: row.schoolLogo,
    depedLogo: row.depedLogo,
    otherLogo: row.otherLogo,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
};

const mapSmtpSettings = (row: EmailSmtpSettingsRow): EmailSmtpSettingsRecord => {
  return {
    id: row.id,
    provider: "gmail",
    gmailEmail: row.gmailEmail,
    gmailAppPassword: row.gmailAppPassword,
    smtpHost: row.smtpHost,
    smtpPort: row.smtpPort,
    smtpSecure: Boolean(row.smtpSecure),
    isEnabled: Boolean(row.isEnabled),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const mapEmailTemplate = (row: EmailTemplateRow): EmailTemplateRecord => {
  return {
    id: row.id,
    templateKey: row.templateKey,
    templateName: row.templateName,
    subject: row.subject,
    htmlContent: row.htmlContent,
    isActive: Boolean(row.isActive),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
};

export const systemRepository = {
  async getSchool(): Promise<SchoolRecord | null> {
    const [rows] = await db.query<SchoolRow[]>(
      `${baseSchoolSelect} WHERE deleted_at IS NULL ORDER BY school_id ASC LIMIT 1`,
    );
    const school = rows[0];

    return school ? mapSchool(school) : null;
  },

  async updateSchool(schoolId: number, payload: UpdateSchoolInput): Promise<SchoolRecord> {
    await db.execute(
      `
        UPDATE schools
        SET
          deped_school_id = ?,
          school_name = ?,
          school_email = ?,
          school_number = ?,
          district = ?,
          division = ?,
          region = ?,
          address = ?,
          school_logo = ?,
          deped_logo = ?,
          other_logo = ?
        WHERE school_id = ? AND deleted_at IS NULL
      `,
      [
        payload.depedSchoolId,
        payload.schoolName,
        payload.schoolEmail,
        payload.schoolNumber,
        payload.district,
        payload.division,
        payload.region,
        payload.address,
        payload.schoolLogo,
        payload.depedLogo,
        payload.otherLogo,
        schoolId,
      ],
    );

    const updatedSchool = await this.getSchool();

    if (!updatedSchool) {
      throw new Error("Failed to fetch updated school settings.");
    }

    return updatedSchool;
  },

  async getEmailSmtpSettings(): Promise<EmailSmtpSettingsRecord | null> {
    const [rows] = await db.query<EmailSmtpSettingsRow[]>(
      `
        SELECT
          id,
          provider,
          gmail_email AS gmailEmail,
          gmail_app_password AS gmailAppPassword,
          smtp_host AS smtpHost,
          smtp_port AS smtpPort,
          smtp_secure AS smtpSecure,
          is_enabled AS isEnabled,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM email_smtp_settings
        ORDER BY id ASC
        LIMIT 1
      `,
    );

    return rows[0] ? mapSmtpSettings(rows[0]) : null;
  },

  async upsertEmailSmtpSettings(payload: UpdateEmailSmtpSettingsInput): Promise<EmailSmtpSettingsRecord> {
    const currentSettings = await this.getEmailSmtpSettings();

    if (currentSettings) {
      await db.execute(
        `
          UPDATE email_smtp_settings
          SET
            provider = 'gmail',
            gmail_email = ?,
            gmail_app_password = ?,
            smtp_host = 'smtp.gmail.com',
            smtp_port = 587,
            smtp_secure = ?,
            is_enabled = ?
          WHERE id = ?
        `,
        [
          payload.gmailEmail,
          payload.gmailAppPassword,
          payload.smtpSecure,
          payload.isEnabled,
          currentSettings.id,
        ],
      );
    } else {
      await db.execute(
        `
          INSERT INTO email_smtp_settings (
            provider,
            gmail_email,
            gmail_app_password,
            smtp_host,
            smtp_port,
            smtp_secure,
            is_enabled
          )
          VALUES ('gmail', ?, ?, 'smtp.gmail.com', 587, ?, ?)
        `,
        [payload.gmailEmail, payload.gmailAppPassword, payload.smtpSecure, payload.isEnabled],
      );
    }

    const updatedSettings = await this.getEmailSmtpSettings();

    if (!updatedSettings) {
      throw new Error("Failed to fetch updated SMTP settings.");
    }

    return updatedSettings;
  },

  async listEmailTemplates(templateKey?: EmailTemplateKey): Promise<EmailTemplateRecord[]> {
    const [rows] = await db.query<EmailTemplateRow[]>(
      `
        SELECT
          id,
          template_key AS templateKey,
          template_name AS templateName,
          subject,
          html_content AS htmlContent,
          is_active AS isActive,
          created_at AS createdAt,
          updated_at AS updatedAt,
          deleted_at AS deletedAt
        FROM email_templates
        WHERE deleted_at IS NULL
          ${templateKey ? "AND template_key = ?" : ""}
        ORDER BY is_active DESC, updated_at DESC, id DESC
      `,
      templateKey ? [templateKey] : [],
    );

    return rows.map(mapEmailTemplate);
  },

  async getEmailTemplate(templateId: number): Promise<EmailTemplateRecord | null> {
    const [rows] = await db.query<EmailTemplateRow[]>(
      `
        SELECT
          id,
          template_key AS templateKey,
          template_name AS templateName,
          subject,
          html_content AS htmlContent,
          is_active AS isActive,
          created_at AS createdAt,
          updated_at AS updatedAt,
          deleted_at AS deletedAt
        FROM email_templates
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1
      `,
      [templateId],
    );

    return rows[0] ? mapEmailTemplate(rows[0]) : null;
  },

  async createEmailTemplate(payload: UpsertEmailTemplateDto): Promise<EmailTemplateRecord> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO email_templates (
          template_key,
          template_name,
          subject,
          html_content,
          is_active
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [payload.templateKey, payload.templateName, payload.subject, payload.htmlContent, Boolean(payload.isActive)],
    );

    const template = await this.getEmailTemplate(result.insertId);

    if (!template) {
      throw new Error("Failed to fetch created email template.");
    }

    return template;
  },

  async updateEmailTemplate(templateId: number, payload: UpsertEmailTemplateDto): Promise<EmailTemplateRecord> {
    await db.execute(
      `
        UPDATE email_templates
        SET
          template_key = ?,
          template_name = ?,
          subject = ?,
          html_content = ?,
          is_active = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [payload.templateKey, payload.templateName, payload.subject, payload.htmlContent, Boolean(payload.isActive), templateId],
    );

    const template = await this.getEmailTemplate(templateId);

    if (!template) {
      throw new Error("Failed to fetch updated email template.");
    }

    return template;
  },

  async activateEmailTemplate(templateId: number, templateKey: EmailTemplateKey): Promise<EmailTemplateRecord> {
    await db.execute(
      "UPDATE email_templates SET is_active = FALSE WHERE template_key = ? AND deleted_at IS NULL",
      [templateKey],
    );
    await db.execute(
      "UPDATE email_templates SET is_active = TRUE WHERE id = ? AND deleted_at IS NULL",
      [templateId],
    );

    const template = await this.getEmailTemplate(templateId);

    if (!template) {
      throw new Error("Failed to fetch activated email template.");
    }

    return template;
  },

  async deleteEmailTemplate(templateId: number): Promise<void> {
    await db.execute(
      "UPDATE email_templates SET deleted_at = CURRENT_TIMESTAMP, is_active = FALSE WHERE id = ? AND deleted_at IS NULL",
      [templateId],
    );
  },

  async getSystemSetting(settingKey: string): Promise<string | null> {
    const [rows] = await db.query<Array<{ settingValue: string } & RowDataPacket>>(
      `
        SELECT setting_value AS settingValue
        FROM system_settings
        WHERE setting_key = ?
        LIMIT 1
      `,
      [settingKey],
    );

    return rows[0]?.settingValue ?? null;
  },

  async upsertSystemSetting(settingKey: string, settingValue: string): Promise<void> {
    await db.execute(
      `
        INSERT INTO system_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          setting_value = VALUES(setting_value)
      `,
      [settingKey, settingValue],
    );
  },

  async getForgotPasswordMethod(): Promise<ForgotPasswordMethod> {
    const value = await this.getSystemSetting("forgot_password_method");

    return value === "otp_email" ? "otp_email" : "temporary_password";
  },

  async updateForgotPasswordMethod(forgotPasswordMethod: ForgotPasswordMethod): Promise<ForgotPasswordMethod> {
    await this.upsertSystemSetting("forgot_password_method", forgotPasswordMethod);
    return this.getForgotPasswordMethod();
  },
};
