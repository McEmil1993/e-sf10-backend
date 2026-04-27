import type { RowDataPacket } from "mysql2";

export type PermissionOverrideType = "allow" | "deny";

export interface CreateAccessModuleInput {
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
}

export interface CreatePermissionInput {
  moduleId: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface CreateRoleInput {
  name: string;
  description: string | null;
}

export interface UserPermissionOverrideInput {
  permissionId: number;
  type: PermissionOverrideType;
}

export interface AccessModuleRecord {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RoleRecord {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PermissionRecord {
  id: number;
  moduleId: number;
  moduleName: string;
  moduleSlug: string;
  moduleIcon: string | null;
  moduleSortOrder: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PermissionOverrideRecord extends PermissionRecord {
  userId: number;
  type: PermissionOverrideType;
}

export interface AccessModuleRow extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserAccessProfile {
  userId: number;
  roles: RoleRecord[];
  permissions: PermissionRecord[];
  permissionSlugs: string[];
  allowOverrides: string[];
  denyOverrides: string[];
}

export interface RoleRow extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PermissionRow extends RowDataPacket {
  id: number;
  moduleId: number;
  moduleName: string;
  moduleSlug: string;
  moduleIcon: string | null;
  moduleSortOrder: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PermissionOverrideRow extends PermissionRow {
  userId: number;
  type: PermissionOverrideType;
}
