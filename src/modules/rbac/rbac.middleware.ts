import type { Request, RequestHandler } from "express";

import { HttpError } from "../../common/utils/http-error";
import { asyncHandler } from "../../common/utils/async-handler";
import { rbacService } from "./rbac.service";

const getAuthenticatedUserId = (request: Request): number => {
  const userId = request.authUser?.userId;

  if (!userId) {
    throw new HttpError(401, "Authentication token is missing or invalid.");
  }

  return userId;
};

export const requireRole = (roleName: string): RequestHandler => {
  return asyncHandler(async (request, _response, next) => {
    const userId = getAuthenticatedUserId(request);
    const hasRole = await rbacService.userHasRole(userId, roleName);

    if (!hasRole) {
      throw new HttpError(403, `Access denied. Missing required role: ${roleName}`);
    }

    next();
  });
};

export const requireAnyRole = (roleNames: string[]): RequestHandler => {
  return asyncHandler(async (request, _response, next) => {
    const userId = getAuthenticatedUserId(request);
    const hasAnyRole = await rbacService.userHasAnyRole(userId, roleNames);

    if (!hasAnyRole) {
      throw new HttpError(403, `Access denied. Required any of these roles: ${roleNames.join(", ")}`);
    }

    next();
  });
};

export const requireAllRoles = (roleNames: string[]): RequestHandler => {
  return asyncHandler(async (request, _response, next) => {
    const userId = getAuthenticatedUserId(request);
    const hasAllRoles = await rbacService.userHasAllRoles(userId, roleNames);

    if (!hasAllRoles) {
      throw new HttpError(403, `Access denied. Required all of these roles: ${roleNames.join(", ")}`);
    }

    next();
  });
};

export const requirePermission = (permissionSlug: string): RequestHandler => {
  return asyncHandler(async (request, _response, next) => {
    const userId = getAuthenticatedUserId(request);
    const hasPermission = await rbacService.userHasPermission(userId, permissionSlug);

    if (!hasPermission) {
      throw new HttpError(403, `Access denied. Missing required permission: ${permissionSlug}`);
    }

    next();
  });
};

export const requireAnyPermission = (permissionSlugs: string[]): RequestHandler => {
  return asyncHandler(async (request, _response, next) => {
    const userId = getAuthenticatedUserId(request);
    const hasAnyPermission = await rbacService.userHasAnyPermission(userId, permissionSlugs);

    if (!hasAnyPermission) {
      throw new HttpError(
        403,
        `Access denied. Required any of these permissions: ${permissionSlugs.join(", ")}`,
      );
    }

    next();
  });
};

export const requireAllPermissions = (permissionSlugs: string[]): RequestHandler => {
  return asyncHandler(async (request, _response, next) => {
    const userId = getAuthenticatedUserId(request);
    const hasAllPermissions = await rbacService.userHasAllPermissions(userId, permissionSlugs);

    if (!hasAllPermissions) {
      throw new HttpError(
        403,
        `Access denied. Required all of these permissions: ${permissionSlugs.join(", ")}`,
      );
    }

    next();
  });
};
