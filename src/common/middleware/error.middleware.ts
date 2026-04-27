import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

import { env } from "../../config/env";
import { uploadConfig } from "../../config/uploads";
import { sendError } from "../response";
import { HttpError } from "../utils/http-error";

export const errorMiddleware = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof HttpError) {
    sendError(response, error.statusCode, error.message, error.details);
    return;
  }

  if (error instanceof MulterError) {
    const uploadErrorMessages: Record<string, string> = {
      LIMIT_FILE_SIZE: `File is too large. Maximum size is ${uploadConfig.maxFileSizeInBytes} bytes.`,
      LIMIT_FILE_COUNT: `Too many files. Maximum is ${uploadConfig.maxFilesPerRequest} files per request.`,
      LIMIT_UNEXPECTED_FILE: "Unexpected upload field.",
    };

    sendError(response, 400, uploadErrorMessages[error.code] ?? error.message);
    return;
  }

  const message = error instanceof Error ? error.message : "Internal server error";

  if (env.NODE_ENV !== "test") {
    console.error(error);
  }

  sendError(response, 500, message);
};
