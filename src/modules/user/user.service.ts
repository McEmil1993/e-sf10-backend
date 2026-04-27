import bcrypt from "bcryptjs";

import { BCRYPT_SALT_ROUNDS } from "../../config/constants";
import { HttpError } from "../../common/utils/http-error";
import { toUserResponseDto } from "./user.dto";
import type {
  ChangeCurrentPasswordDto,
  CreateUserDto,
  CreateUserInput,
  UpdateUserDto,
  UpdateUserInput,
  UserRecord,
} from "./user.interface";
import { userRepository } from "./user.repository";

const buildDisplayName = (
  firstName: string,
  middleName: string | null,
  lastName: string | null,
  suffix: string | null,
): string => {
  const parts = [firstName, middleName, lastName, suffix]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .map((part) => part.trim());

  return parts.join(" ").trim() || firstName.trim();
};

const ensureEmailIsAvailable = async (email: string, currentUserId?: number): Promise<void> => {
  const existingUser = await userRepository.findByEmailIncludingDeleted(email);

  if (existingUser && existingUser.id !== currentUserId) {
    throw new HttpError(409, "Email is already in use.");
  }
};

const ensureUsernameIsAvailable = async (
  username: string | null,
  currentUserId?: number,
): Promise<void> => {
  if (!username) {
    return;
  }

  const existingUser = await userRepository.findByUsernameIncludingDeleted(username);

  if (existingUser && existingUser.id !== currentUserId) {
    throw new HttpError(409, "Username is already in use.");
  }
};

const buildCreateUserInput = async (payload: CreateUserDto): Promise<CreateUserInput> => {
  await ensureEmailIsAvailable(payload.email);
  await ensureUsernameIsAvailable(payload.username);

  const passwordHash = await bcrypt.hash(payload.password, BCRYPT_SALT_ROUNDS);
  const computedName = payload.name ?? buildDisplayName(
    payload.firstName,
    payload.middleName,
    payload.lastName,
    payload.suffix,
  );

  return {
    name: computedName,
    firstName: payload.firstName,
    middleName: payload.middleName,
    lastName: payload.lastName,
    suffix: payload.suffix,
    sex: payload.sex,
    email: payload.email,
    contactNumber: payload.contactNumber,
    address: payload.address,
    barangay: payload.barangay,
    municipalityCity: payload.municipalityCity,
    province: payload.province,
    region: payload.region,
    username: payload.username,
    passwordHash,
    roles: payload.roles,
    position: payload.position,
    status: payload.status,
    profilePicture: payload.profilePicture,
  };
};

const buildUpdateUserInput = async (
  currentUser: UserRecord,
  payload: UpdateUserDto,
): Promise<UpdateUserInput> => {
  const firstName = payload.firstName ?? currentUser.firstName;
  const middleName = payload.middleName === undefined ? currentUser.middleName : payload.middleName;
  const lastName = payload.lastName === undefined ? currentUser.lastName : payload.lastName;
  const suffix = payload.suffix === undefined ? currentUser.suffix : payload.suffix;
  const email = payload.email ?? currentUser.email;
  const username = payload.username === undefined ? currentUser.username : payload.username;
  const passwordHash = payload.password
    ? await bcrypt.hash(payload.password, BCRYPT_SALT_ROUNDS)
    : currentUser.passwordHash;

  await ensureEmailIsAvailable(email, currentUser.id);
  await ensureUsernameIsAvailable(username, currentUser.id);

  const namePartsWereUpdated =
    payload.firstName !== undefined ||
    payload.middleName !== undefined ||
    payload.lastName !== undefined ||
    payload.suffix !== undefined;

  const name = payload.name !== undefined
    ? payload.name ?? buildDisplayName(firstName, middleName, lastName, suffix)
    : namePartsWereUpdated
      ? buildDisplayName(firstName, middleName, lastName, suffix)
      : currentUser.name;

  return {
    name,
    firstName,
    middleName,
    lastName,
    suffix,
    sex: payload.sex === undefined ? currentUser.sex : payload.sex,
    email,
    contactNumber: payload.contactNumber === undefined ? currentUser.contactNumber : payload.contactNumber,
    address: payload.address === undefined ? currentUser.address : payload.address,
    barangay: payload.barangay === undefined ? currentUser.barangay : payload.barangay,
    municipalityCity:
      payload.municipalityCity === undefined ? currentUser.municipalityCity : payload.municipalityCity,
    province: payload.province === undefined ? currentUser.province : payload.province,
    region: payload.region === undefined ? currentUser.region : payload.region,
    username,
    passwordHash,
    roles: payload.roles ?? currentUser.roles,
    position: payload.position === undefined ? currentUser.position : payload.position,
    status: payload.status ?? currentUser.status,
    profilePicture: payload.profilePicture === undefined ? currentUser.profilePicture : payload.profilePicture,
  };
};

export const userService = {
  async getAllUsers() {
    const users = await userRepository.findAll();
    return users.map(toUserResponseDto);
  },

  async getCurrentUser(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    return toUserResponseDto(user);
  },

  async updateCurrentUser(userId: number, payload: UpdateUserDto) {
    const nextPayload: UpdateUserDto = { ...payload };
    delete nextPayload.roles;
    delete nextPayload.status;
    delete nextPayload.password;

    if (Object.keys(nextPayload).length === 0) {
      throw new HttpError(400, "At least one editable profile field is required for update.");
    }

    return this.updateUser(userId, nextPayload);
  },

  async changeCurrentPassword(userId: number, payload: ChangeCurrentPasswordDto) {
    const currentUser = await userRepository.findById(userId);

    if (!currentUser) {
      throw new HttpError(404, "User not found.");
    }

    const isCurrentPasswordValid = await bcrypt.compare(payload.currentPassword, currentUser.passwordHash);

    if (!isCurrentPasswordValid) {
      throw new HttpError(401, "Current password is incorrect.");
    }

    const nextPasswordHash = await bcrypt.hash(payload.newPassword, BCRYPT_SALT_ROUNDS);
    await userRepository.updatePasswordHash(userId, nextPasswordHash);
  },

  async getUserById(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    return toUserResponseDto(user);
  },

  async createUser(payload: CreateUserDto) {
    const createUserInput = await buildCreateUserInput(payload);
    const user = await userRepository.createUser(createUserInput);
    return toUserResponseDto(user);
  },

  async updateUser(userId: number, payload: UpdateUserDto) {
    const currentUser = await userRepository.findById(userId);

    if (!currentUser) {
      throw new HttpError(404, "User not found.");
    }

    const updateUserInput = await buildUpdateUserInput(currentUser, payload);
    const updatedUser = await userRepository.updateUser(userId, updateUserInput);
    return toUserResponseDto(updatedUser);
  },

  async deleteUser(userId: number) {
    const currentUser = await userRepository.findById(userId);

    if (!currentUser) {
      throw new HttpError(404, "User not found.");
    }

    await userRepository.softDeleteUser(userId);
  },
};
