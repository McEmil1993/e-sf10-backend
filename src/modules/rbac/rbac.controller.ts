import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import {
  getRequiredRouteParam,
  parseCreateAccessModuleDto,
  parseCreatePermissionDto,
  parseCreateRoleDto,
  parseIdParam,
  parseReplaceRolePermissionsDto,
  parseReplaceUserPermissionOverridesDto,
  parseReplaceUserRolesDto,
  parseUpdateAccessModuleDto,
  parseUpdatePermissionDto,
  parseUpdateRoleDto,
  toAccessModuleResponseDto,
  toPermissionOverrideResponseDto,
  toPermissionResponseDto,
  toRoleResponseDto,
  toUserAccessProfileResponseDto,
} from "./rbac.dto";
import { rbacService } from "./rbac.service";

export const rbacController = {
  async listModules(_request: Request, response: Response): Promise<void> {
    const modules = await rbacService.listModules();
    sendSuccess(response, 200, "RBAC modules fetched successfully.", modules.map(toAccessModuleResponseDto));
  },

  async getModuleById(request: Request, response: Response): Promise<void> {
    const moduleId = parseIdParam(getRequiredRouteParam(request.params.id, "moduleId"), "moduleId");
    const module = await rbacService.getModuleById(moduleId);
    sendSuccess(response, 200, "RBAC module fetched successfully.", toAccessModuleResponseDto(module));
  },

  async createModule(request: Request, response: Response): Promise<void> {
    const payload = parseCreateAccessModuleDto(request.body);
    const module = await rbacService.createModule(payload);
    sendSuccess(response, 201, "RBAC module created successfully.", toAccessModuleResponseDto(module));
  },

  async updateModule(request: Request, response: Response): Promise<void> {
    const moduleId = parseIdParam(getRequiredRouteParam(request.params.id, "moduleId"), "moduleId");
    const payload = parseUpdateAccessModuleDto(request.body);
    const module = await rbacService.updateModule(moduleId, payload);
    sendSuccess(response, 200, "RBAC module updated successfully.", toAccessModuleResponseDto(module));
  },

  async deleteModule(request: Request, response: Response): Promise<void> {
    const moduleId = parseIdParam(getRequiredRouteParam(request.params.id, "moduleId"), "moduleId");
    await rbacService.deleteModule(moduleId);
    sendSuccess(response, 200, "RBAC module soft deleted successfully.");
  },

  async listPermissions(_request: Request, response: Response): Promise<void> {
    const permissions = await rbacService.listPermissions();
    sendSuccess(
      response,
      200,
      "Permissions fetched successfully.",
      permissions.map(toPermissionResponseDto),
    );
  },

  async getPermissionById(request: Request, response: Response): Promise<void> {
    const permissionId = parseIdParam(getRequiredRouteParam(request.params.id, "permissionId"), "permissionId");
    const permission = await rbacService.getPermissionById(permissionId);
    sendSuccess(response, 200, "Permission fetched successfully.", toPermissionResponseDto(permission));
  },

  async createPermission(request: Request, response: Response): Promise<void> {
    const payload = parseCreatePermissionDto(request.body);
    const permission = await rbacService.createPermission(payload);
    sendSuccess(response, 201, "Permission created successfully.", toPermissionResponseDto(permission));
  },

  async updatePermission(request: Request, response: Response): Promise<void> {
    const permissionId = parseIdParam(getRequiredRouteParam(request.params.id, "permissionId"), "permissionId");
    const payload = parseUpdatePermissionDto(request.body);
    const permission = await rbacService.updatePermission(permissionId, payload);
    sendSuccess(response, 200, "Permission updated successfully.", toPermissionResponseDto(permission));
  },

  async deletePermission(request: Request, response: Response): Promise<void> {
    const permissionId = parseIdParam(getRequiredRouteParam(request.params.id, "permissionId"), "permissionId");
    await rbacService.deletePermission(permissionId);
    sendSuccess(response, 200, "Permission soft deleted successfully.");
  },

  async listRoles(_request: Request, response: Response): Promise<void> {
    const roles = await rbacService.listRoles();
    sendSuccess(response, 200, "Roles fetched successfully.", roles.map(toRoleResponseDto));
  },

  async getRoleById(request: Request, response: Response): Promise<void> {
    const roleId = parseIdParam(getRequiredRouteParam(request.params.id, "roleId"), "roleId");
    const role = await rbacService.getRoleById(roleId);
    sendSuccess(response, 200, "Role fetched successfully.", toRoleResponseDto(role));
  },

  async createRole(request: Request, response: Response): Promise<void> {
    const payload = parseCreateRoleDto(request.body);
    const role = await rbacService.createRole(payload);
    sendSuccess(response, 201, "Role created successfully.", toRoleResponseDto(role));
  },

  async updateRole(request: Request, response: Response): Promise<void> {
    const roleId = parseIdParam(getRequiredRouteParam(request.params.id, "roleId"), "roleId");
    const payload = parseUpdateRoleDto(request.body);
    const role = await rbacService.updateRole(roleId, payload);
    sendSuccess(response, 200, "Role updated successfully.", toRoleResponseDto(role));
  },

  async deleteRole(request: Request, response: Response): Promise<void> {
    const roleId = parseIdParam(getRequiredRouteParam(request.params.id, "roleId"), "roleId");
    await rbacService.deleteRole(roleId);
    sendSuccess(response, 200, "Role soft deleted successfully.");
  },

  async getRolePermissions(request: Request, response: Response): Promise<void> {
    const roleId = parseIdParam(getRequiredRouteParam(request.params.roleId, "roleId"), "roleId");
    const permissions = await rbacService.getRolePermissionsByRoleId(roleId);
    sendSuccess(
      response,
      200,
      "Role permissions fetched successfully.",
      permissions.map(toPermissionResponseDto),
    );
  },

  async replaceRolePermissions(request: Request, response: Response): Promise<void> {
    const roleId = parseIdParam(getRequiredRouteParam(request.params.roleId, "roleId"), "roleId");
    const payload = parseReplaceRolePermissionsDto(request.body);
    const permissions = await rbacService.replaceRolePermissions(roleId, payload.permissionIds);
    sendSuccess(
      response,
      200,
      "Role permissions updated successfully.",
      permissions.map(toPermissionResponseDto),
    );
  },

  async getUserRoles(request: Request, response: Response): Promise<void> {
    const userId = parseIdParam(getRequiredRouteParam(request.params.userId, "userId"), "userId");
    const roles = await rbacService.getUserRoles(userId);
    sendSuccess(response, 200, "User roles fetched successfully.", roles.map(toRoleResponseDto));
  },

  async replaceUserRoles(request: Request, response: Response): Promise<void> {
    const userId = parseIdParam(getRequiredRouteParam(request.params.userId, "userId"), "userId");
    const payload = parseReplaceUserRolesDto(request.body);
    const roles = await rbacService.replaceUserRoles(userId, payload.roleIds);
    sendSuccess(response, 200, "User roles updated successfully.", roles.map(toRoleResponseDto));
  },

  async getUserPermissionOverrides(request: Request, response: Response): Promise<void> {
    const userId = parseIdParam(getRequiredRouteParam(request.params.userId, "userId"), "userId");
    const overrides = await rbacService.getUserPermissionOverrides(userId);
    sendSuccess(
      response,
      200,
      "User permission overrides fetched successfully.",
      overrides.map(toPermissionOverrideResponseDto),
    );
  },

  async replaceUserPermissionOverrides(request: Request, response: Response): Promise<void> {
    const userId = parseIdParam(getRequiredRouteParam(request.params.userId, "userId"), "userId");
    const payload = parseReplaceUserPermissionOverridesDto(request.body);
    const overrides = await rbacService.replaceUserPermissionOverrides(userId, payload.overrides);
    sendSuccess(
      response,
      200,
      "User permission overrides updated successfully.",
      overrides.map(toPermissionOverrideResponseDto),
    );
  },

  async getUserAccessProfile(request: Request, response: Response): Promise<void> {
    const userId = parseIdParam(getRequiredRouteParam(request.params.userId, "userId"), "userId");
    const accessProfile = await rbacService.getUserAccessProfile(userId);
    sendSuccess(
      response,
      200,
      "User access profile fetched successfully.",
      toUserAccessProfileResponseDto(accessProfile),
    );
  },
};
