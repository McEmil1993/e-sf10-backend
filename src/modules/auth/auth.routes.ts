import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { authController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", asyncHandler(authController.register));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.post("/forgot-password", asyncHandler(authController.forgotPassword));
authRouter.post("/forgot-password/otp/verify", asyncHandler(authController.verifyForgotPasswordOtp));
authRouter.get(
  "/temporary-password/:recoveryRequestId",
  authMiddleware,
  asyncHandler(authController.getTemporaryPasswordSession),
);
authRouter.put(
  "/temporary-password",
  authMiddleware,
  asyncHandler(authController.completeTemporaryPassword),
);
authRouter.post("/logout", authMiddleware, asyncHandler(authController.logout));

export default authRouter;
