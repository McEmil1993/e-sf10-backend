export { rbacRepository } from "./rbac.repository";
export { rbacService } from "./rbac.service";
export { rbacController } from "./rbac.controller";
export { default as rbacRouter } from "./rbac.routes";
export {
  requireAllPermissions,
  requireAllRoles,
  requireAnyPermission,
  requireAnyRole,
  requirePermission,
  requireRole,
} from "./rbac.middleware";
export type {
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
