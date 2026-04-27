import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { BCRYPT_SALT_ROUNDS } from "../../config/constants";
import { env } from "../../config/env";
import { HttpError } from "../../common/utils/http-error";
import { authTokenBlacklist } from "../../common/utils/auth-token-blacklist";
import { toUserResponseDto } from "../user/user.dto";
import type { UserRecord } from "../user/user.interface";
import type { LoginDto, RegisterDto } from "./auth.dto";
import { authRepository } from "./auth.repository";

const generateAccessToken = (user: UserRecord): string => {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  const expiresIn = env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

export const authService = {
  async register(payload: RegisterDto) {
    const existingUser = await authRepository.findByEmailIncludingDeleted(payload.email.toLowerCase());

    if (existingUser) {
      throw new HttpError(409, "Email is already registered.");
    }

    const passwordHash = await bcrypt.hash(payload.password, BCRYPT_SALT_ROUNDS);
    const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(" ").trim();

    const createdUser = await authRepository.createUser({
      name: fullName || payload.firstName,
      firstName: payload.firstName,
      middleName: null,
      lastName: payload.lastName,
      suffix: null,
      sex: null,
      email: payload.email.toLowerCase(),
      contactNumber: null,
      address: null,
      barangay: null,
      municipalityCity: null,
      province: null,
      region: null,
      username: null,
      passwordHash,
      roles: ["user"],
      position: null,
      status: "active",
      profilePicture: null,
    });

    return {
      user: toUserResponseDto(createdUser),
      token: generateAccessToken(createdUser),
    };
  },

  async login(payload: LoginDto) {
    const user = await authRepository.findByEmail(payload.email.toLowerCase());

    if (!user) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid email or password.");
    }

    return {
      user: toUserResponseDto(user),
      token: generateAccessToken(user),
    };
  },

  async logout(token: string | undefined, expiresAt?: number) {
    if (!token) {
      throw new HttpError(401, "Authentication token is missing or invalid.");
    }

    authTokenBlacklist.blacklistToken(token, expiresAt);
  },
};
