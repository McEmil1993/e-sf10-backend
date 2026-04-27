import { HttpError } from "../../common/utils/http-error";
import type {
  AccessModuleRecord,
  CreateAccessModuleInput,
  CreatePermissionInput,
  CreateRoleInput,
  PermissionOverrideRecord,
  PermissionOverrideType,
  PermissionRecord,
  RoleRecord,
  UserAccessProfile,
  UserPermissionOverrideInput,
} from "./rbac.interface";

export interface AccessModuleResponseDto {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionResponseDto {
  id: number;
  moduleId: number;
  moduleName: string;
  moduleSlug: string;
  moduleIcon: string | null;
  moduleSortOrder: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleResponseDto {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionOverrideResponseDto extends PermissionResponseDto {
  userId: number;
  type: PermissionOverrideType;
}

export interface UserAccessProfileResponseDto {
  userId: number;
  roles: RoleResponseDto[];
  permissions: PermissionResponseDto[];
  permissionSlugs: string[];
  allowOverrides: string[];
  denyOverrides: string[];
}

export interface ReplaceRolePermissionsDto {
  permissionIds: number[];
}

export interface ReplaceUserRolesDto {
  roleIds: number[];
}

export interface ReplaceUserPermissionOverridesDto {
  overrides: UserPermissionOverrideInput[];
}

const toIsoString = (value: Date | string): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
};

const getBodyObject = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new HttpError(400, "Request body must be a valid JSON object.");
  }

  return payload as Record<string, unknown>;
};

const getRequiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} is required.`);
  }

  return value.trim();
};

const getOptionalNullableString = (value: unknown, fieldName: string): string | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string.`);
  }

  return value.trim();
};

const getRequiredInteger = (value: unknown, fieldName: string): number => {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new HttpError(400, `${fieldName} must be an integer.`);
  }

  return value;
};

const getPositiveInteger = (value: unknown, fieldName: string): number => {
  const parsedValue = getRequiredInteger(value, fieldName);

  if (parsedValue <= 0) {
    throw new HttpError(400, `${fieldName} must be greater than 0.`);
  }

  return parsedValue;
};

const getNonNegativeInteger = (value: unknown, fieldName: string): number => {
  const parsedValue = getRequiredInteger(value, fieldName);

  if (parsedValue < 0) {
    throw new HttpError(400, `${fieldName} must be 0 or greater.`);
  }

  return parsedValue;
};

const getRequiredSlug = (value: unknown, fieldName: string): string => {
  const slug = getRequiredString(value, fieldName).toLowerCase();

  if (!/^[a-z0-9._-]+$/.test(slug)) {
    throw new HttpError(
      400,
      `${fieldName} must only contain lowercase letters, numbers, dots, underscores, or hyphens.`,
    );
  }

  return slug;
};

const getIntegerArray = (value: unknown, fieldName: string): number[] => {
  if (!Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be an array.`);
  }

  const values = value.map((item, index) => getPositiveInteger(item, `${fieldName}[${index}]`));
  return Array.from(new Set(values));
};

export const parseIdParam = (value: string, fieldName = "id"): number => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  return parsedValue;
};

export const getRequiredRouteParam = (
  value: string | string[] | undefined,
  fieldName: string,
): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} route parameter is required.`);
  }

  return value;
};

export const parseCreateAccessModuleDto = (payload: unknown): CreateAccessModuleInput => {
  const body = getBodyObject(payload);

  return {
    name: getRequiredString(body.name, "name"),
    slug: getRequiredSlug(body.slug, "slug"),
    icon: getOptionalNullableString(body.icon, "icon"),
    sortOrder: getNonNegativeInteger(body.sortOrder, "sortOrder"),
  };
};

export const parseUpdateAccessModuleDto = parseCreateAccessModuleDto;

export const parseCreatePermissionDto = (payload: unknown): CreatePermissionInput => {
  const body = getBodyObject(payload);

  return {
    moduleId: getPositiveInteger(body.moduleId, "moduleId"),
    name: getRequiredString(body.name, "name"),
    slug: getRequiredSlug(body.slug, "slug"),
    description: getOptionalNullableString(body.description, "description"),
  };
};

export const parseUpdatePermissionDto = parseCreatePermissionDto;

export const parseCreateRoleDto = (payload: unknown): CreateRoleInput => {
  const body = getBodyObject(payload);

  return {
    name: getRequiredSlug(body.name, "name"),
    description: getOptionalNullableString(body.description, "description"),
  };
};

export const parseUpdateRoleDto = parseCreateRoleDto;

export const parseReplaceRolePermissionsDto = (payload: unknown): ReplaceRolePermissionsDto => {
  const body = getBodyObject(payload);

  return {
    permissionIds: getIntegerArray(body.permissionIds, "permissionIds"),
  };
};

export const parseReplaceUserRolesDto = (payload: unknown): ReplaceUserRolesDto => {
  const body = getBodyObject(payload);

  return {
    roleIds: getIntegerArray(body.roleIds, "roleIds"),
  };
};

export const parseReplaceUserPermissionOverridesDto = (
  payload: unknown,
): ReplaceUserPermissionOverridesDto => {
  const body = getBodyObject(payload);

  if (!Array.isArray(body.overrides)) {
    throw new HttpError(400, "overrides must be an array.");
  }

  const seenPermissionIds = new Set<number>();

  const overrides = body.overrides.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new HttpError(400, `overrides[${index}] must be a valid object.`);
    }

    const override = item as Record<string, unknown>;
    const permissionId = getPositiveInteger(override.permissionId, `overrides[${index}].permissionId`);
    const type = override.type as PermissionOverrideType;

    if (type !== "allow" && type !== "deny") {
      throw new HttpError(400, `overrides[${index}].type must be either "allow" or "deny".`);
    }

    if (seenPermissionIds.has(permissionId)) {
      throw new HttpError(400, `Duplicate permissionId found in overrides: ${permissionId}`);
    }

    seenPermissionIds.add(permissionId);

    return {
      permissionId,
      type,
    };
  });

  return { overrides };
};

export const toAccessModuleResponseDto = (module: AccessModuleRecord): AccessModuleResponseDto => {
  return {
    id: module.id,
    name: module.name,
    slug: module.slug,
    icon: module.icon,
    sortOrder: module.sortOrder,
    createdAt: toIsoString(module.createdAt),
    updatedAt: toIsoString(module.updatedAt),
  };
};

export const toPermissionResponseDto = (permission: PermissionRecord): PermissionResponseDto => {
  return {
    id: permission.id,
    moduleId: permission.moduleId,
    moduleName: permission.moduleName,
    moduleSlug: permission.moduleSlug,
    moduleIcon: permission.moduleIcon,
    moduleSortOrder: permission.moduleSortOrder,
    name: permission.name,
    slug: permission.slug,
    description: permission.description,
    createdAt: toIsoString(permission.createdAt),
    updatedAt: toIsoString(permission.updatedAt),
  };
};

export const toRoleResponseDto = (role: RoleRecord): RoleResponseDto => {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    createdAt: toIsoString(role.createdAt),
    updatedAt: toIsoString(role.updatedAt),
  };
};

export const toPermissionOverrideResponseDto = (
  override: PermissionOverrideRecord,
): PermissionOverrideResponseDto => {
  return {
    ...toPermissionResponseDto(override),
    userId: override.userId,
    type: override.type,
  };
};

export const toUserAccessProfileResponseDto = (
  accessProfile: UserAccessProfile,
): UserAccessProfileResponseDto => {
  return {
    userId: accessProfile.userId,
    roles: accessProfile.roles.map(toRoleResponseDto),
    permissions: accessProfile.permissions.map(toPermissionResponseDto),
    permissionSlugs: accessProfile.permissionSlugs,
    allowOverrides: accessProfile.allowOverrides,
    denyOverrides: accessProfile.denyOverrides,
  };
};
