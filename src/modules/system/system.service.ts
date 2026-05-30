import { HttpError } from "../../common/utils/http-error";
import {
  toEmailSmtpSettingsResponseDto,
  toEmailTemplateResponseDto,
  toPasswordRecoverySettingsResponseDto,
  toSchoolResponseDto,
} from "./system.dto";
import type {
  EmailTemplateKey,
  UpdatePasswordRecoverySettingsDto,
  UpdateEmailSmtpSettingsDto,
  UpdateSchoolDto,
  UpsertEmailTemplateDto,
} from "./system.interface";
import { systemRepository } from "./system.repository";

export const systemService = {
  async getSchool() {
    const school = await systemRepository.getSchool();

    if (!school) {
      throw new HttpError(404, "School settings not found.");
    }

    return toSchoolResponseDto(school);
  },

  async updateSchool(payload: UpdateSchoolDto) {
    const currentSchool = await systemRepository.getSchool();

    if (!currentSchool) {
      throw new HttpError(404, "School settings not found.");
    }

    const updatedSchool = await systemRepository.updateSchool(currentSchool.schoolId, {
      depedSchoolId: payload.depedSchoolId ?? currentSchool.depedSchoolId,
      schoolName: payload.schoolName ?? currentSchool.schoolName,
      schoolEmail: payload.schoolEmail === undefined ? currentSchool.schoolEmail : payload.schoolEmail,
      schoolNumber: payload.schoolNumber === undefined ? currentSchool.schoolNumber : payload.schoolNumber,
      district: payload.district ?? currentSchool.district,
      division: payload.division ?? currentSchool.division,
      region: payload.region ?? currentSchool.region,
      address: payload.address ?? currentSchool.address,
      schoolLogo: payload.schoolLogo === undefined ? currentSchool.schoolLogo : payload.schoolLogo,
      depedLogo: payload.depedLogo === undefined ? currentSchool.depedLogo : payload.depedLogo,
      otherLogo: payload.otherLogo === undefined ? currentSchool.otherLogo : payload.otherLogo,
    });

    return toSchoolResponseDto(updatedSchool);
  },

  async getEmailSmtpSettings() {
    const settings = await systemRepository.getEmailSmtpSettings();
    return toEmailSmtpSettingsResponseDto(settings);
  },

  async updateEmailSmtpSettings(payload: UpdateEmailSmtpSettingsDto) {
    const currentSettings = await systemRepository.getEmailSmtpSettings();
    const gmailEmail = payload.gmailEmail ?? currentSettings?.gmailEmail ?? "";
    const gmailAppPassword = payload.gmailAppPassword ?? currentSettings?.gmailAppPassword ?? "";

    if (!gmailEmail) {
      throw new HttpError(400, "gmailEmail is required.");
    }

    if (!gmailAppPassword) {
      throw new HttpError(400, "gmailAppPassword is required.");
    }

    const updatedSettings = await systemRepository.upsertEmailSmtpSettings({
      gmailEmail,
      gmailAppPassword,
      smtpSecure: payload.smtpSecure ?? currentSettings?.smtpSecure ?? false,
      isEnabled: payload.isEnabled ?? currentSettings?.isEnabled ?? true,
    });

    return toEmailSmtpSettingsResponseDto(updatedSettings);
  },

  async getPasswordRecoverySettings() {
    const forgotPasswordMethod = await systemRepository.getForgotPasswordMethod();
    return toPasswordRecoverySettingsResponseDto(forgotPasswordMethod);
  },

  async updatePasswordRecoverySettings(payload: UpdatePasswordRecoverySettingsDto) {
    const forgotPasswordMethod = await systemRepository.updateForgotPasswordMethod(payload.forgotPasswordMethod);
    return toPasswordRecoverySettingsResponseDto(forgotPasswordMethod);
  },

  async listEmailTemplates(templateKey?: EmailTemplateKey) {
    const templates = await systemRepository.listEmailTemplates(templateKey);
    return templates.map(toEmailTemplateResponseDto);
  },

  async createEmailTemplate(payload: UpsertEmailTemplateDto) {
    const template = await systemRepository.createEmailTemplate(payload);

    if (payload.isActive) {
      const activatedTemplate = await systemRepository.activateEmailTemplate(template.id, template.templateKey);
      return toEmailTemplateResponseDto(activatedTemplate);
    }

    return toEmailTemplateResponseDto(template);
  },

  async updateEmailTemplate(templateId: number, payload: UpsertEmailTemplateDto) {
    const existingTemplate = await systemRepository.getEmailTemplate(templateId);

    if (!existingTemplate) {
      throw new HttpError(404, "Email template not found.");
    }

    const template = await systemRepository.updateEmailTemplate(templateId, payload);

    if (payload.isActive) {
      const activatedTemplate = await systemRepository.activateEmailTemplate(template.id, template.templateKey);
      return toEmailTemplateResponseDto(activatedTemplate);
    }

    return toEmailTemplateResponseDto(template);
  },

  async activateEmailTemplate(templateId: number) {
    const existingTemplate = await systemRepository.getEmailTemplate(templateId);

    if (!existingTemplate) {
      throw new HttpError(404, "Email template not found.");
    }

    const template = await systemRepository.activateEmailTemplate(templateId, existingTemplate.templateKey);
    return toEmailTemplateResponseDto(template);
  },

  async deleteEmailTemplate(templateId: number) {
    const existingTemplate = await systemRepository.getEmailTemplate(templateId);

    if (!existingTemplate) {
      throw new HttpError(404, "Email template not found.");
    }

    await systemRepository.deleteEmailTemplate(templateId);
  },
};
