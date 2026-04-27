import express from "express";

import { ensureBackupDirectory } from "./config/backups";
import { env } from "./config/env";
import { API_PREFIX } from "./config/constants";
import { ensureUploadDirectory, uploadConfig } from "./config/uploads";
import { authMiddleware } from "./common/middleware/auth.middleware";
import { errorMiddleware } from "./common/middleware/error.middleware";
import { notFoundMiddleware } from "./common/middleware/not-found.middleware";
import { sendSuccess } from "./common/response";
import { setupSwagger } from "./docs/swagger";
import apiRouter from "./routes";

const app = express();

ensureUploadDirectory();
ensureBackupDirectory();

app.use((request, response, next) => {
  const requestOrigin = request.headers.origin;
  const isAllowedOrigin =
    typeof requestOrigin === "string" &&
    env.CORS_ORIGINS.some((origin) => origin === "*" || origin === requestOrigin);

  if (isAllowedOrigin && requestOrigin) {
    response.setHeader("Access-Control-Allow-Origin", requestOrigin);
    response.setHeader("Vary", "Origin");
    response.setHeader("Access-Control-Allow-Credentials", "true");
  }

  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadConfig.publicPath, authMiddleware, express.static(uploadConfig.directoryPath));
setupSwagger(app);

app.get("/health", (_request, response) => {
  sendSuccess(response, 200, "Backend v2 server is running.", {
    environment: env.NODE_ENV,
  });
});

app.use(API_PREFIX, apiRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
