import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { systemController } from "./system.controller";

const systemRouter = Router();

systemRouter.use(authMiddleware);

systemRouter.get("/school", asyncHandler(systemController.getSchool));
systemRouter.put("/school", asyncHandler(systemController.updateSchool));
systemRouter.get("/email/smtp", asyncHandler(systemController.getEmailSmtpSettings));
systemRouter.put("/email/smtp", asyncHandler(systemController.updateEmailSmtpSettings));
systemRouter.get("/password-recovery", asyncHandler(systemController.getPasswordRecoverySettings));
systemRouter.put("/password-recovery", asyncHandler(systemController.updatePasswordRecoverySettings));
systemRouter.get("/email/templates", asyncHandler(systemController.listEmailTemplates));
systemRouter.post("/email/templates", asyncHandler(systemController.createEmailTemplate));
systemRouter.put("/email/templates/:templateId", asyncHandler(systemController.updateEmailTemplate));
systemRouter.put("/email/templates/:templateId/activate", asyncHandler(systemController.activateEmailTemplate));
systemRouter.delete("/email/templates/:templateId", asyncHandler(systemController.deleteEmailTemplate));

export default systemRouter;
