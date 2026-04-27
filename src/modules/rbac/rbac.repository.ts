import type { ResultSetHeader } from "mysql2";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";

import { db } from "../../config/db";
import type {
  AccessModuleRecord,
  AccessModuleRow,
  CreateAccessModuleInput,
  CreatePermissionInput,
  CreateRoleInput,
  PermissionOverrideRecord,
  PermissionOverrideRow,
  PermissionRecord,
  PermissionRow,
  RoleRecord,
  RoleRow,
  UserPermissionOverrideInput,
} from "./rbac.interface";

interface EntityIdRow extends RowDataPacket {
  id: number;
}

const moduleSelect = `
  SELECT
    m.id,
    m.name,
    m.slug,
    m.icon,
    m.sort_order AS sortOrder,
    m.created_at AS createdAt,
    m.updated_at AS updatedAt
  FROM modules m
`;

const roleSelect = `
  SELECT
    r.id,
    r.name,
    r.description,
    r.created_at AS createdAt,
    r.updated_at AS updatedAt
  FROM roles r
`;

const permissionSelect = `
  SELECT
    p.id,
    p.module_id AS moduleId,
    m.name AS moduleName,
    m.slug AS moduleSlug,
    m.icon AS moduleIcon,
    m.sort_order AS moduleSortOrder,
    p.name,
    p.slug,
    p.description,
    p.created_at AS createdAt,
    p.updated_at AS updatedAt
  FROM permissions p
  INNER JOIN modules m ON m.id = p.module_id AND m.deleted_at IS NULL
`;

const permissionSelectIncludingDeleted = `
  SELECT
    p.id,
    p.module_id AS moduleId,
    m.name AS moduleName,
    m.slug AS moduleSlug,
    m.icon AS moduleIcon,
    m.sort_order AS moduleSortOrder,
    p.name,
    p.slug,
    p.description,
    p.created_at AS createdAt,
    p.updated_at AS updatedAt
  FROM permissions p
  INNER JOIN modules m ON m.id = p.module_id
`;

const mapModule = (row: AccessModuleRow): AccessModuleRecord => {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const mapRole = (row: RoleRow): RoleRecord => {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const mapPermission = (row: PermissionRow): PermissionRecord => {
  return {
    id: row.id,
    moduleId: row.moduleId,
    moduleName: row.moduleName,
    moduleSlug: row.moduleSlug,
    moduleIcon: row.moduleIcon,
    moduleSortOrder: row.moduleSortOrder,
    name: row.name,
    slug: row.slug,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const mapPermissionOverride = (row: PermissionOverrideRow): PermissionOverrideRecord => {
  return {
    ...mapPermission(row),
    userId: row.userId,
    type: row.type,
  };
};

const createPlaceholders = (count: number): string => {
  return Array.from({ length: count }, () => "?").join(", ");
};

const replaceRolePermissionsInTransaction = async (
  connection: PoolConnection,
  roleId: number,
  permissionIds: number[],
): Promise<void> => {
  await connection.execute(
    `
      UPDATE role_permissions
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE role_id = ? AND deleted_at IS NULL
    `,
    [roleId],
  );

  if (permissionIds.length === 0) {
    return;
  }

  const placeholders = permissionIds.map(() => "(?, ?, NULL)").join(", ");
  const values = permissionIds.flatMap((permissionId) => [roleId, permissionId]);

  await connection.execute(
    `
      INSERT INTO role_permissions (role_id, permission_id, deleted_at)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE deleted_at = NULL
    `,
    values,
  );
};

const replaceUserRolesInTransaction = async (
  connection: PoolConnection,
  userId: number,
  roleIds: number[],
): Promise<void> => {
  await connection.execute(
    `
      UPDATE user_roles
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND deleted_at IS NULL
    `,
    [userId],
  );

  if (roleIds.length === 0) {
    return;
  }

  const placeholders = roleIds.map(() => "(?, ?, NOW(), NULL)").join(", ");
  const values = roleIds.flatMap((roleId) => [userId, roleId]);

  await connection.execute(
    `
      INSERT INTO user_roles (user_id, role_id, assigned_at, deleted_at)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP, deleted_at = NULL
    `,
    values,
  );
};

const replaceUserPermissionOverridesInTransaction = async (
  connection: PoolConnection,
  userId: number,
  overrides: UserPermissionOverrideInput[],
): Promise<void> => {
  await connection.execute(
    `
      UPDATE user_permissions
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND deleted_at IS NULL
    `,
    [userId],
  );

  if (overrides.length === 0) {
    return;
  }

  const placeholders = overrides.map(() => "(?, ?, ?, NULL)").join(", ");
  const values = overrides.flatMap((override) => [userId, override.permissionId, override.type]);

  await connection.execute(
    `
      INSERT INTO user_permissions (user_id, permission_id, type, deleted_at)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE type = VALUES(type), deleted_at = NULL, updated_at = CURRENT_TIMESTAMP
    `,
    values,
  );
};

const softDeleteModuleInTransaction = async (connection: PoolConnection, moduleId: number): Promise<void> => {
  await connection.execute(
    `
      UPDATE modules
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `,
    [moduleId],
  );

  await connection.execute(
    `
      UPDATE permissions
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE module_id = ? AND deleted_at IS NULL
    `,
    [moduleId],
  );

  await connection.execute(
    `
      UPDATE role_permissions rp
      INNER JOIN permissions p ON p.id = rp.permission_id
      SET rp.deleted_at = CURRENT_TIMESTAMP
      WHERE p.module_id = ? AND rp.deleted_at IS NULL
    `,
    [moduleId],
  );

  await connection.execute(
    `
      UPDATE user_permissions up
      INNER JOIN permissions p ON p.id = up.permission_id
      SET up.deleted_at = CURRENT_TIMESTAMP, up.updated_at = CURRENT_TIMESTAMP
      WHERE p.module_id = ? AND up.deleted_at IS NULL
    `,
    [moduleId],
  );
};

const softDeletePermissionInTransaction = async (
  connection: PoolConnection,
  permissionId: number,
): Promise<void> => {
  await connection.execute(
    `
      UPDATE permissions
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `,
    [permissionId],
  );

  await connection.execute(
    `
      UPDATE role_permissions
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE permission_id = ? AND deleted_at IS NULL
    `,
    [permissionId],
  );

  await connection.execute(
    `
      UPDATE user_permissions
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE permission_id = ? AND deleted_at IS NULL
    `,
    [permissionId],
  );
};

const softDeleteRoleInTransaction = async (connection: PoolConnection, roleId: number): Promise<void> => {
  await connection.execute(
    `
      UPDATE roles
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `,
    [roleId],
  );

  await connection.execute(
    `
      UPDATE role_permissions
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE role_id = ? AND deleted_at IS NULL
    `,
    [roleId],
  );

  await connection.execute(
    `
      UPDATE user_roles
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE role_id = ? AND deleted_at IS NULL
    `,
    [roleId],
  );
};

export const rbacRepository = {
  async listModules(): Promise<AccessModuleRecord[]> {
    const [rows] = await db.query<AccessModuleRow[]>(
      `${moduleSelect} WHERE m.deleted_at IS NULL ORDER BY m.sort_order ASC, m.id ASC`,
    );
    return rows.map(mapModule);
  },

  async findModuleById(moduleId: number): Promise<AccessModuleRecord | null> {
    const [rows] = await db.query<AccessModuleRow[]>(
      `${moduleSelect} WHERE m.id = ? AND m.deleted_at IS NULL LIMIT 1`,
      [moduleId],
    );
    const module = rows[0];
    return module ? mapModule(module) : null;
  },

  async findModuleBySlug(slug: string): Promise<AccessModuleRecord | null> {
    const [rows] = await db.query<AccessModuleRow[]>(
      `${moduleSelect} WHERE m.slug = ? AND m.deleted_at IS NULL LIMIT 1`,
      [slug],
    );
    const module = rows[0];
    return module ? mapModule(module) : null;
  },

  async findModuleBySlugIncludingDeleted(slug: string): Promise<AccessModuleRecord | null> {
    const [rows] = await db.query<AccessModuleRow[]>(
      `${moduleSelect} WHERE m.slug = ? LIMIT 1`,
      [slug],
    );
    const module = rows[0];
    return module ? mapModule(module) : null;
  },

  async createModule(payload: CreateAccessModuleInput): Promise<AccessModuleRecord> {
    await db.execute<ResultSetHeader>(
      `
        INSERT INTO modules (name, slug, icon, sort_order, deleted_at)
        VALUES (?, ?, ?, ?, NULL)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          icon = VALUES(icon),
          sort_order = VALUES(sort_order),
          deleted_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      `,
      [payload.name, payload.slug, payload.icon, payload.sortOrder],
    );

    const createdModule = await this.findModuleBySlug(payload.slug);

    if (!createdModule) {
      throw new Error("Failed to fetch created module.");
    }

    return createdModule;
  },

  async updateModule(moduleId: number, payload: CreateAccessModuleInput): Promise<AccessModuleRecord> {
    await db.execute(
      `
        UPDATE modules
        SET name = ?, slug = ?, icon = ?, sort_order = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [payload.name, payload.slug, payload.icon, payload.sortOrder, moduleId],
    );

    const updatedModule = await this.findModuleById(moduleId);

    if (!updatedModule) {
      throw new Error("Failed to fetch updated module.");
    }

    return updatedModule;
  },

  async deleteModule(moduleId: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      await softDeleteModuleInTransaction(connection, moduleId);
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getUserRoles(userId: number): Promise<RoleRecord[]> {
    const [rows] = await db.query<RoleRow[]>(
      `
        ${roleSelect}
        INNER JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = ? AND ur.deleted_at IS NULL AND r.deleted_at IS NULL
        ORDER BY r.name ASC
      `,
      [userId],
    );

    return rows.map(mapRole);
  },

  async listRoles(): Promise<RoleRecord[]> {
    const [rows] = await db.query<RoleRow[]>(
      `${roleSelect} WHERE r.deleted_at IS NULL ORDER BY r.name ASC`,
    );
    return rows.map(mapRole);
  },

  async findRoleById(roleId: number): Promise<RoleRecord | null> {
    const [rows] = await db.query<RoleRow[]>(
      `${roleSelect} WHERE r.id = ? AND r.deleted_at IS NULL LIMIT 1`,
      [roleId],
    );
    const role = rows[0];
    return role ? mapRole(role) : null;
  },

  async findRoleByName(name: string): Promise<RoleRecord | null> {
    const [rows] = await db.query<RoleRow[]>(
      `${roleSelect} WHERE r.name = ? AND r.deleted_at IS NULL LIMIT 1`,
      [name],
    );
    const role = rows[0];
    return role ? mapRole(role) : null;
  },

  async findRoleByNameIncludingDeleted(name: string): Promise<RoleRecord | null> {
    const [rows] = await db.query<RoleRow[]>(
      `${roleSelect} WHERE r.name = ? LIMIT 1`,
      [name],
    );
    const role = rows[0];
    return role ? mapRole(role) : null;
  },

  async createRole(payload: CreateRoleInput): Promise<RoleRecord> {
    await db.execute<ResultSetHeader>(
      `
        INSERT INTO roles (name, description, deleted_at)
        VALUES (?, ?, NULL)
        ON DUPLICATE KEY UPDATE
          description = VALUES(description),
          deleted_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      `,
      [payload.name, payload.description],
    );

    const createdRole = await this.findRoleByName(payload.name);

    if (!createdRole) {
      throw new Error("Failed to fetch created role.");
    }

    return createdRole;
  },

  async updateRole(roleId: number, payload: CreateRoleInput): Promise<RoleRecord> {
    await db.execute(
      `
        UPDATE roles
        SET name = ?, description = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [payload.name, payload.description, roleId],
    );

    const updatedRole = await this.findRoleById(roleId);

    if (!updatedRole) {
      throw new Error("Failed to fetch updated role.");
    }

    return updatedRole;
  },

  async deleteRole(roleId: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      await softDeleteRoleInTransaction(connection, roleId);
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getRolePermissions(userId: number): Promise<PermissionRecord[]> {
    const [rows] = await db.query<PermissionRow[]>(
      `
        ${permissionSelect}
        INNER JOIN role_permissions rp ON rp.permission_id = p.id
        INNER JOIN user_roles ur ON ur.role_id = rp.role_id
        INNER JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = ?
          AND ur.deleted_at IS NULL
          AND rp.deleted_at IS NULL
          AND r.deleted_at IS NULL
          AND p.deleted_at IS NULL
        ORDER BY m.sort_order ASC, p.slug ASC
      `,
      [userId],
    );

    return rows.map(mapPermission);
  },

  async listPermissions(): Promise<PermissionRecord[]> {
    const [rows] = await db.query<PermissionRow[]>(
      `${permissionSelect} WHERE p.deleted_at IS NULL ORDER BY m.sort_order ASC, p.slug ASC`,
    );
    return rows.map(mapPermission);
  },

  async findPermissionById(permissionId: number): Promise<PermissionRecord | null> {
    const [rows] = await db.query<PermissionRow[]>(
      `${permissionSelect} WHERE p.id = ? AND p.deleted_at IS NULL LIMIT 1`,
      [permissionId],
    );
    const permission = rows[0];
    return permission ? mapPermission(permission) : null;
  },

  async findPermissionBySlug(slug: string): Promise<PermissionRecord | null> {
    const [rows] = await db.query<PermissionRow[]>(
      `${permissionSelect} WHERE p.slug = ? AND p.deleted_at IS NULL LIMIT 1`,
      [slug],
    );
    const permission = rows[0];
    return permission ? mapPermission(permission) : null;
  },

  async findPermissionBySlugIncludingDeleted(slug: string): Promise<PermissionRecord | null> {
    const [rows] = await db.query<PermissionRow[]>(
      `${permissionSelectIncludingDeleted} WHERE p.slug = ? LIMIT 1`,
      [slug],
    );
    const permission = rows[0];
    return permission ? mapPermission(permission) : null;
  },

  async findPermissionsByIds(permissionIds: number[]): Promise<PermissionRecord[]> {
    if (permissionIds.length === 0) {
      return [];
    }

    const [rows] = await db.query<PermissionRow[]>(
      `${permissionSelect} WHERE p.id IN (${createPlaceholders(permissionIds.length)}) AND p.deleted_at IS NULL`,
      permissionIds,
    );

    return rows.map(mapPermission);
  },

  async createPermission(payload: CreatePermissionInput): Promise<PermissionRecord> {
    await db.execute<ResultSetHeader>(
      `
        INSERT INTO permissions (module_id, name, slug, description, deleted_at)
        VALUES (?, ?, ?, ?, NULL)
        ON DUPLICATE KEY UPDATE
          module_id = VALUES(module_id),
          name = VALUES(name),
          description = VALUES(description),
          deleted_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      `,
      [payload.moduleId, payload.name, payload.slug, payload.description],
    );

    const createdPermission = await this.findPermissionBySlug(payload.slug);

    if (!createdPermission) {
      throw new Error("Failed to fetch created permission.");
    }

    return createdPermission;
  },

  async updatePermission(permissionId: number, payload: CreatePermissionInput): Promise<PermissionRecord> {
    await db.execute(
      `
        UPDATE permissions
        SET module_id = ?, name = ?, slug = ?, description = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [payload.moduleId, payload.name, payload.slug, payload.description, permissionId],
    );

    const updatedPermission = await this.findPermissionById(permissionId);

    if (!updatedPermission) {
      throw new Error("Failed to fetch updated permission.");
    }

    return updatedPermission;
  },

  async deletePermission(permissionId: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      await softDeletePermissionInTransaction(connection, permissionId);
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getRolePermissionsByRoleId(roleId: number): Promise<PermissionRecord[]> {
    const [rows] = await db.query<PermissionRow[]>(
      `
        ${permissionSelect}
        INNER JOIN role_permissions rp ON rp.permission_id = p.id
        WHERE rp.role_id = ? AND rp.deleted_at IS NULL AND p.deleted_at IS NULL
        ORDER BY m.sort_order ASC, p.slug ASC
      `,
      [roleId],
    );

    return rows.map(mapPermission);
  },

  async replaceRolePermissions(roleId: number, permissionIds: number[]): Promise<void> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      await replaceRolePermissionsInTransaction(connection, roleId, permissionIds);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getUserPermissionOverrides(userId: number): Promise<PermissionOverrideRecord[]> {
    const [rows] = await db.query<PermissionOverrideRow[]>(
      `
        SELECT
          up.user_id AS userId,
          up.type,
          p.id,
          p.module_id AS moduleId,
          m.name AS moduleName,
          m.slug AS moduleSlug,
          m.icon AS moduleIcon,
          m.sort_order AS moduleSortOrder,
          p.name,
          p.slug,
          p.description,
          p.created_at AS createdAt,
          p.updated_at AS updatedAt
        FROM user_permissions up
        INNER JOIN permissions p ON p.id = up.permission_id
        INNER JOIN modules m ON m.id = p.module_id
        WHERE up.user_id = ?
          AND up.deleted_at IS NULL
          AND p.deleted_at IS NULL
          AND m.deleted_at IS NULL
        ORDER BY m.sort_order ASC, p.slug ASC
      `,
      [userId],
    );

    return rows.map(mapPermissionOverride);
  },

  async findRolesByIds(roleIds: number[]): Promise<RoleRecord[]> {
    if (roleIds.length === 0) {
      return [];
    }

    const [rows] = await db.query<RoleRow[]>(
      `${roleSelect} WHERE r.id IN (${createPlaceholders(roleIds.length)}) AND r.deleted_at IS NULL`,
      roleIds,
    );

    return rows.map(mapRole);
  },

  async replaceUserRoles(userId: number, roleIds: number[]): Promise<void> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      await replaceUserRolesInTransaction(connection, userId, roleIds);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async replaceUserPermissionOverrides(
    userId: number,
    overrides: UserPermissionOverrideInput[],
  ): Promise<void> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      await replaceUserPermissionOverridesInTransaction(connection, userId, overrides);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async userExists(userId: number): Promise<boolean> {
    const [rows] = await db.query<EntityIdRow[]>(
      `
        SELECT id
        FROM users
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1
      `,
      [userId],
    );

    return rows.length > 0;
  },
};
