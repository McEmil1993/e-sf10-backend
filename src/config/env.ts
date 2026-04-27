import dotenv from "dotenv";

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const getNumberEnv = (key: string, fallback?: number): number => {
  const rawValue = process.env[key];

  if (!rawValue) {
    if (fallback === undefined) {
      throw new Error(`Missing required numeric environment variable: ${key}`);
    }

    return fallback;
  }

  const parsedValue = Number(rawValue);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }

  return parsedValue;
};

const dbConnection = process.env.DB_CONNECTION ?? "mysql";

if (dbConnection !== "mysql") {
  throw new Error(`Unsupported DB_CONNECTION "${dbConnection}". Only "mysql" is supported.`);
}

export const env = {
  PORT: getNumberEnv("PORT", 5555),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? "http://localhost:3333")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  DB_CONNECTION: dbConnection,
  DB_HOST: getRequiredEnv("DB_HOST"),
  DB_USER: getRequiredEnv("DB_USER"),
  DB_PASS: getRequiredEnv("DB_PASS"),
  DB_NAME: getRequiredEnv("DB_NAME"),
  DB_PORT: getNumberEnv("DB_PORT", 3306),
  JWT_SECRET: getRequiredEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
} as const;
