import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import { HttpError } from "../../common/utils/http-error";
import {
  parseEmailTemplateKey,
  parseUpdatePasswordRecoverySettingsDto,
  parseUpdateEmailSmtpSettingsDto,
  parseUpdateSchoolDto,
  parseUpsertEmailTemplateDto,
} from "./system.dto";
import { systemService } from "./system.service";

const getNumericParam = (value: string | string[] | undefined, fieldName: string): number => {
  if (Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be a positive integer.`);
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer.`);
  }

  return id;
};

export const systemController = {
  async getSchool(_request: Request, response: Response): Promise<void> {
    const school = await systemService.getSchool();
    sendSuccess(response, 200, "School settings fetched successfully.", school);
  },

  async updateSchool(request: Request, response: Response): Promise<void> {
    const payload = parseUpdateSchoolDto(request.body);
    const school = await systemService.updateSchool(payload);
    sendSuccess(response, 200, "School settings updated successfully.", school);
  },

  async getEmailSmtpSettings(_request: Request, response: Response): Promise<void> {
    const settings = await systemService.getEmailSmtpSettings();
    sendSuccess(response, 200, "SMTP settings fetched successfully.", settings);
  },

  async updateEmailSmtpSettings(request: Request, response: Response): Promise<void> {
    const payload = parseUpdateEmailSmtpSettingsDto(request.body);
    const settings = await systemService.updateEmailSmtpSettings(payload);
    sendSuccess(response, 200, "SMTP settings updated successfully.", settings);
  },

  async getPasswordRecoverySettings(_request: Request, response: Response): Promise<void> {
    const settings = await systemService.getPasswordRecoverySettings();
    sendSuccess(response, 200, "Password recovery settings fetched successfully.", settings);
  },

  async updatePasswordRecoverySettings(request: Request, response: Response): Promise<void> {
    const payload = parseUpdatePasswordRecoverySettingsDto(request.body);
    const settings = await systemService.updatePasswordRecoverySettings(payload);
    sendSuccess(response, 200, "Password recovery settings updated successfully.", settings);
  },

  async listEmailTemplates(request: Request, response: Response): Promise<void> {
    const templateKey = parseEmailTemplateKey(request.query.templateKey);
    const templates = await systemService.listEmailTemplates(templateKey);
    sendSuccess(response, 200, "Email templates fetched successfully.", templates);
  },

  async createEmailTemplate(request: Request, response: Response): Promise<void> {
    const payload = parseUpsertEmailTemplateDto(request.body);
    const template = await systemService.createEmailTemplate(payload);
    sendSuccess(response, 201, "Email template created successfully.", template);
  },

  async updateEmailTemplate(request: Request, response: Response): Promise<void> {
    const templateId = getNumericParam(request.params.templateId, "templateId");
    const payload = parseUpsertEmailTemplateDto(request.body);
    const template = await systemService.updateEmailTemplate(templateId, payload);
    sendSuccess(response, 200, "Email template updated successfully.", template);
  },

  async activateEmailTemplate(request: Request, response: Response): Promise<void> {
    const templateId = getNumericParam(request.params.templateId, "templateId");
    const template = await systemService.activateEmailTemplate(templateId);
    sendSuccess(response, 200, "Email template activated successfully.", template);
  },

  async deleteEmailTemplate(request: Request, response: Response): Promise<void> {
    const templateId = getNumericParam(request.params.templateId, "templateId");
    await systemService.deleteEmailTemplate(templateId);
    sendSuccess(response, 200, "Email template deleted successfully.", null);
  },
};
