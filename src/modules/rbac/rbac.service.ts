import type {
  AccessModuleRecord,
  CreateAccessModuleInput,
  CreatePermissionInput,
  CreateRoleInput,
  PermissionOverrideRecord,
  PermissionRecord,
  RoleRecord,
  UserAccessProfile,
  UserPermissionOverrideInput,
} from "./rbac.interface";
import { HttpError } from "../../common/utils/http-error";
import { rbacRepository } from "./rbac.repository";

const sortPermissions = (permissions: PermissionRecord[]): PermissionRecord[] => {
  return [...permissions].sort((left, right) => {
    if (left.moduleSortOrder !== right.moduleSortOrder) {
      return left.moduleSortOrder - right.moduleSortOrder;
    }

    return left.slug.localeCompare(right.slug);
  });
};

const mergeEffectivePermissions = (
  rolePermissions: PermissionRecord[],
  overrides: PermissionOverrideRecord[],
): {
  permissions: PermissionRecord[];
  allowOverrides: string[];
  denyOverrides: string[];
} => {
  const effectivePermissions = new Map<string, PermissionRecord>();

  for (const permission of rolePermissions) {
    effectivePermissions.set(permission.slug, permission);
  }

  const allowOverrides: string[] = [];
  const denyOverrides: string[] = [];

  for (const override of overrides) {
    if (override.type === "allow") {
      effectivePermissions.set(override.slug, override);
      allowOverrides.push(override.slug);
      continue;
    }

    effectivePermissions.delete(override.slug);
    denyOverrides.push(override.slug);
  }

  return {
    permissions: sortPermissions(Array.from(effectivePermissions.values())),
    allowOverrides: Array.from(new Set(allowOverrides)).sort(),
    denyOverrides: Array.from(new Set(denyOverrides)).sort(),
  };
};

const ensureUserExists = async (userId: number): Promise<void> => {
  const userExists = await rbacRepository.userExists(userId);

  if (!userExists) {
    throw new HttpError(404, "User not found.");
  }
};

const ensureModuleExists = async (moduleId: number): Promise<AccessModuleRecord> => {
  const module = await rbacRepository.findModuleById(moduleId);

  if (!module) {
    throw new HttpError(404, "Module not found.");
  }

  return module;
};

const ensurePermissionExists = async (permissionId: number): Promise<PermissionRecord> => {
  const permission = await rbacRepository.findPermissionById(permissionId);

  if (!permission) {
    throw new HttpError(404, "Permission not found.");
  }

  return permission;
};

const ensureRoleExists = async (roleId: number): Promise<RoleRecord> => {
  const role = await rbacRepository.findRoleById(roleId);

  if (!role) {
    throw new HttpError(404, "Role not found.");
  }

  return role;
};

const ensurePermissionIdsExist = async (permissionIds: number[]): Promise<void> => {
  if (permissionIds.length === 0) {
    return;
  }

  const permissions = await rbacRepository.findPermissionsByIds(permissionIds);
  const existingPermissionIds = new Set(permissions.map((permission) => permission.id));
  const missingPermissionIds = permissionIds.filter((permissionId) => !existingPermissionIds.has(permissionId));

  if (missingPermissionIds.length > 0) {
    throw new HttpError(404, `Permissions not found: ${missingPermissionIds.join(", ")}`);
  }
};

const ensureRoleIdsExist = async (roleIds: number[]): Promise<void> => {
  if (roleIds.length === 0) {
    return;
  }

  const roles = await rbacRepository.findRolesByIds(roleIds);
  const existingRoleIds = new Set(roles.map((role) => role.id));
  const missingRoleIds = roleIds.filter((roleId) => !existingRoleIds.has(roleId));

  if (missingRoleIds.length > 0) {
    throw new HttpError(404, `Roles not found: ${missingRoleIds.join(", ")}`);
  }
};

export const rbacService = {
  async listModules(): Promise<AccessModuleRecord[]> {
    return rbacRepository.listModules();
  },

  async getModuleById(moduleId: number): Promise<AccessModuleRecord> {
    return ensureModuleExists(moduleId);
  },

  async createModule(payload: CreateAccessModuleInput): Promise<AccessModuleRecord> {
    const existingModule = await rbacRepository.findModuleBySlug(payload.slug);

    if (existingModule) {
      throw new HttpError(409, "Module slug already exists.");
    }

    return rbacRepository.createModule(payload);
  },

  async updateModule(moduleId: number, payload: CreateAccessModuleInput): Promise<AccessModuleRecord> {
    await ensureModuleExists(moduleId);

    const existingModule = await rbacRepository.findModuleBySlugIncludingDeleted(payload.slug);

    if (existingModule && existingModule.id !== moduleId) {
      throw new HttpError(409, "Module slug already exists.");
    }

    return rbacRepository.updateModule(moduleId, payload);
  },

  async deleteModule(moduleId: number): Promise<void> {
    await ensureModuleExists(moduleId);
    await rbacRepository.deleteModule(moduleId);
  },

  async getUserAccessProfile(userId: number): Promise<UserAccessProfile> {
    await ensureUserExists(userId);

    const [roles, rolePermissions, overrides] = await Promise.all([
      rbacRepository.getUserRoles(userId),
      rbacRepository.getRolePermissions(userId),
      rbacRepository.getUserPermissionOverrides(userId),
    ]);

    const mergedPermissions = mergeEffectivePermissions(rolePermissions, overrides);

    return {
      userId,
      roles,
      permissions: mergedPermissions.permissions,
      permissionSlugs: mergedPermissions.permissions.map((permission) => permission.slug),
      allowOverrides: mergedPermissions.allowOverrides,
      denyOverrides: mergedPermissions.denyOverrides,
    };
  },

  async listPermissions(): Promise<PermissionRecord[]> {
    return rbacRepository.listPermissions();
  },

  async getPermissionById(permissionId: number): Promise<PermissionRecord> {
    return ensurePermissionExists(permissionId);
  },

  async createPermission(payload: CreatePermissionInput): Promise<PermissionRecord> {
    await ensureModuleExists(payload.moduleId);

    const existingPermission = await rbacRepository.findPermissionBySlug(payload.slug);

    if (existingPermission) {
      throw new HttpError(409, "Permission slug already exists.");
    }

    return rbacRepository.createPermission(payload);
  },

  async updatePermission(permissionId: number, payload: CreatePermissionInput): Promise<PermissionRecord> {
    await ensurePermissionExists(permissionId);
    await ensureModuleExists(payload.moduleId);

    const existingPermission = await rbacRepository.findPermissionBySlugIncludingDeleted(payload.slug);

    if (existingPermission && existingPermission.id !== permissionId) {
      throw new HttpError(409, "Permission slug already exists.");
    }

    return rbacRepository.updatePermission(permissionId, payload);
  },

  async deletePermission(permissionId: number): Promise<void> {
    await ensurePermissionExists(permissionId);
    await rbacRepository.deletePermission(permissionId);
  },

  async listRoles(): Promise<RoleRecord[]> {
    return rbacRepository.listRoles();
  },

  async getRoleById(roleId: number): Promise<RoleRecord> {
    return ensureRoleExists(roleId);
  },

  async createRole(payload: CreateRoleInput): Promise<RoleRecord> {
    const existingRole = await rbacRepository.findRoleByName(payload.name);

    if (existingRole) {
      throw new HttpError(409, "Role name already exists.");
    }

    return rbacRepository.createRole(payload);
  },

  async updateRole(roleId: number, payload: CreateRoleInput): Promise<RoleRecord> {
    await ensureRoleExists(roleId);

    const existingRole = await rbacRepository.findRoleByNameIncludingDeleted(payload.name);

    if (existingRole && existingRole.id !== roleId) {
      throw new HttpError(409, "Role name already exists.");
    }

    return rbacRepository.updateRole(roleId, payload);
  },

  async deleteRole(roleId: number): Promise<void> {
    await ensureRoleExists(roleId);
    await rbacRepository.deleteRole(roleId);
  },

  async getUserRoles(userId: number): Promise<RoleRecord[]> {
    await ensureUserExists(userId);
    return rbacRepository.getUserRoles(userId);
  },

  async getRolePermissionsByRoleId(roleId: number): Promise<PermissionRecord[]> {
    await ensureRoleExists(roleId);
    return rbacRepository.getRolePermissionsByRoleId(roleId);
  },

  async replaceRolePermissions(roleId: number, permissionIds: number[]): Promise<PermissionRecord[]> {
    await ensureRoleExists(roleId);
    await ensurePermissionIdsExist(permissionIds);
    await rbacRepository.replaceRolePermissions(roleId, permissionIds);

    return rbacRepository.getRolePermissionsByRoleId(roleId);
  },

  async getUserRoleNames(userId: number): Promise<string[]> {
    const roles = await rbacRepository.getUserRoles(userId);
    return roles.map((role) => role.name);
  },

  async getUserPermissions(userId: number): Promise<PermissionRecord[]> {
    const accessProfile = await this.getUserAccessProfile(userId);
    return accessProfile.permissions;
  },

  async replaceUserRoles(userId: number, roleIds: number[]): Promise<RoleRecord[]> {
    await ensureUserExists(userId);
    await ensureRoleIdsExist(roleIds);
    await rbacRepository.replaceUserRoles(userId, roleIds);
    return rbacRepository.getUserRoles(userId);
  },

  async getUserPermissionOverrides(userId: number): Promise<PermissionOverrideRecord[]> {
    await ensureUserExists(userId);
    return rbacRepository.getUserPermissionOverrides(userId);
  },

  async replaceUserPermissionOverrides(
    userId: number,
    overrides: UserPermissionOverrideInput[],
  ): Promise<PermissionOverrideRecord[]> {
    await ensureUserExists(userId);
    await ensurePermissionIdsExist(overrides.map((override) => override.permissionId));
    await rbacRepository.replaceUserPermissionOverrides(userId, overrides);
    return rbacRepository.getUserPermissionOverrides(userId);
  },

  async getUserPermissionSlugs(userId: number): Promise<string[]> {
    const accessProfile = await this.getUserAccessProfile(userId);
    return accessProfile.permissionSlugs;
  },

  async userHasRole(userId: number, roleName: string): Promise<boolean> {
    const roleNames = await this.getUserRoleNames(userId);
    return roleNames.includes(roleName);
  },

  async userHasAnyRole(userId: number, roleNames: string[]): Promise<boolean> {
    const assignedRoles = await this.getUserRoleNames(userId);
    const assignedRoleSet = new Set(assignedRoles);

    return roleNames.some((roleName) => assignedRoleSet.has(roleName));
  },

  async userHasAllRoles(userId: number, roleNames: string[]): Promise<boolean> {
    const assignedRoles = await this.getUserRoleNames(userId);
    const assignedRoleSet = new Set(assignedRoles);

    return roleNames.every((roleName) => assignedRoleSet.has(roleName));
  },

  async userHasPermission(userId: number, permissionSlug: string): Promise<boolean> {
    const permissionSlugs = await this.getUserPermissionSlugs(userId);
    return permissionSlugs.includes(permissionSlug);
  },

  async userHasAnyPermission(userId: number, permissionSlugs: string[]): Promise<boolean> {
    const assignedPermissions = await this.getUserPermissionSlugs(userId);
    const assignedPermissionSet = new Set(assignedPermissions);

    return permissionSlugs.some((permissionSlug) => assignedPermissionSet.has(permissionSlug));
  },

  async userHasAllPermissions(userId: number, permissionSlugs: string[]): Promise<boolean> {
    const assignedPermissions = await this.getUserPermissionSlugs(userId);
    const assignedPermissionSet = new Set(assignedPermissions);

    return permissionSlugs.every((permissionSlug) => assignedPermissionSet.has(permissionSlug));
  },
};
