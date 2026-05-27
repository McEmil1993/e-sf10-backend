# API Info

## Overview

This file is a quick reference for the current Swagger-documented API of `backend-v2`.

- Swagger UI: `http://localhost:5555/docs`
- OpenAPI JSON: `http://localhost:5555/docs.json`
- Base API URL: `http://localhost:5555/api`
- Auth type for protected endpoints: `Bearer JWT`

## Common Response Format

Successful response:

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Something went wrong.",
  "errors": {}
}
```

## Postman Quick Setup

### 1. Create a collection

Create a Postman collection named `backend-v2`.

### 2. Add collection variables

Add these variables:

- `base_url` = `http://localhost:5555`
- `api_url` = `{{base_url}}/api`
- `token` = leave empty at first

### 3. Set auth for protected requests

For protected endpoints, use:

- Authorization type: `Bearer Token`
- Token value: `{{token}}`

### 4. Save token automatically after login or register

In Postman, open the `Tests` tab of the login or register request and use:

```javascript
const json = pm.response.json();

if (json.success && json.data && json.data.token) {
  pm.collectionVariables.set("token", json.data.token);
}
```

### 5. How to test file upload in Postman

For upload endpoints:

- Method: `POST`
- Body type: `form-data`
- Single upload field: `file`
- Multiple upload field: `files`
- File type column must be `File`, not `Text`

## Suggested Testing Order

1. `POST /api/auth/register` or `POST /api/auth/login`
2. Save JWT token to `{{token}}`
3. Test protected endpoints such as `GET /api/users/me`
4. Test uploads
5. Test RBAC endpoints

## System Endpoints

### GET `/health`

- Auth: `No`
- Purpose: Check if server is running
- Body: `None`

### GET `/api`

- Auth: `No`
- Purpose: Show API root metadata and registered modules
- Body: `None`

## Auth Endpoints

### POST `/api/auth/register`

- Auth: `No`
- Purpose: Register a new user and return JWT token
- Body:

```json
{
  "firstName": "Mark",
  "lastName": "Dacoylo",
  "email": "mark@example.com",
  "password": "password123"
}
```

### POST `/api/auth/login`

- Auth: `No`
- Purpose: Login user and return JWT token
- Body:

```json
{
  "email": "mark@example.com",
  "password": "password123"
}
```

### POST `/api/auth/logout`

- Auth: `Yes`
- Purpose: Logout the current authenticated user
- Body: `None`
- Header:
  - `Authorization: Bearer {{token}}`
- Postman test tip:
  - call this endpoint after login
  - then try `GET /api/users/me` using the same token
  - expected result: `401`

## Users Endpoints

All endpoints below require `Bearer {{token}}`.

### GET `/api/users`

- Purpose: List all active users
- Body: `None`

### POST `/api/users`

- Purpose: Create a user
- Body:

```json
{
  "name": "Mark Emil Dacoylo",
  "firstName": "Mark",
  "middleName": "Emil",
  "lastName": "Dacoylo",
  "suffix": "",
  "sex": "male",
  "email": "mark@example.com",
  "contactNumber": "09171234567",
  "address": "Purok 1, San Isidro",
  "barangay": "San Isidro",
  "municipalityCity": "Talisay City",
  "province": "Cebu",
  "region": "Region VII",
  "username": "mark.dacoylo",
  "password": "StrongPassword123!",
  "roles": ["admin", "developer"],
  "position": "System Administrator",
  "status": "active",
  "profilePicture": "https://randomuser.me/api/portraits/men/1.jpg"
}
```

### GET `/api/users/me`

- Purpose: Get current authenticated user
- Body: `None`

### GET `/api/users/{id}`

- Purpose: Get one user by ID
- Path param:
  - `id` = user ID
- Body: `None`

### PUT `/api/users/{id}`

- Purpose: Update a user
- Path param:
  - `id` = user ID
- Body: send only fields you want to update

```json
{
  "firstName": "Mark",
  "lastName": "Dacoylo",
  "status": "inactive",
  "position": "Updated Position"
}
```

### DELETE `/api/users/{id}`

- Purpose: Soft delete a user
- Path param:
  - `id` = user ID
- Body: `None`
- Note: this does not hard delete the record, it sets soft delete info

## Uploads Endpoints

All endpoints below require `Bearer {{token}}`.

Allowed upload categories:

- `images`
- `pdf`
- `excel`
- `sql`
- `csv`
- `text`
- `documents`

### GET `/api/uploads/config`

- Purpose: Show upload config
- Body: `None`

### GET `/api/uploads/files`

- Purpose: List uploaded files
- Query params:
  - `category` = optional, one of `all`, `images`, `pdf`, `excel`, `sql`, `csv`, `text`, `documents`
- Examples:
  - `GET /api/uploads/files`
  - `GET /api/uploads/files?category=sql`

### GET `/api/uploads/files/{category}/{filename}/view`

- Purpose: View one uploaded file through protected API
- Path params:
  - `category` = file category
  - `filename` = stored filename
- Body: `None`

### DELETE `/api/uploads/files/{category}/{filename}`

- Purpose: Delete one uploaded file from storage
- Path params:
  - `category` = file category
  - `filename` = stored filename
- Body: `None`

### POST `/api/uploads/single`

- Purpose: Upload one file
- Body type: `form-data`
- Field:
  - `file` = actual file

### POST `/api/uploads/multiple`

- Purpose: Upload multiple files
- Body type: `form-data`
- Field:
  - `files` = actual files
- Max files per request: `40`

## RBAC Endpoints

All endpoints below require `Bearer {{token}}`.

`RBAC` means `Role-Based Access Control`.

- `module` = feature group like student, grades, reports, users
- `permission` = action like `student.view` or `user.can_edit`
- `role` = group of permissions like `admin`, `teacher`, `staff`

### RBAC Modules

#### GET `/api/rbac/modules`

- Purpose: List RBAC modules
- Body: `None`

#### POST `/api/rbac/modules`

- Purpose: Create RBAC module
- Body:

```json
{
  "name": "Student Management",
  "slug": "student",
  "icon": "users",
  "sortOrder": 1
}
```

#### GET `/api/rbac/modules/{id}`

- Purpose: Get RBAC module by ID
- Path param:
  - `id` = module ID

#### PUT `/api/rbac/modules/{id}`

- Purpose: Update RBAC module
- Path param:
  - `id` = module ID
- Body:

```json
{
  "name": "Student Management",
  "slug": "student",
  "icon": "users",
  "sortOrder": 1
}
```

#### DELETE `/api/rbac/modules/{id}`

- Purpose: Soft delete RBAC module
- Path param:
  - `id` = module ID

### RBAC Permissions

#### GET `/api/rbac/permissions`

- Purpose: List permissions
- Body: `None`

#### POST `/api/rbac/permissions`

- Purpose: Create permission
- Body:

```json
{
  "moduleId": 1,
  "name": "View Students",
  "slug": "student.view",
  "description": "Access the student listing and profiles."
}
```

Note:

- `moduleId` should be an existing RBAC module ID
- In Swagger, this field is described from active modules

#### GET `/api/rbac/permissions/{id}`

- Purpose: Get permission by ID
- Path param:
  - `id` = permission ID

#### PUT `/api/rbac/permissions/{id}`

- Purpose: Update permission
- Path param:
  - `id` = permission ID
- Body:

```json
{
  "moduleId": 1,
  "name": "View Students",
  "slug": "student.view",
  "description": "Access the student listing and profiles."
}
```

#### DELETE `/api/rbac/permissions/{id}`

- Purpose: Soft delete permission
- Path param:
  - `id` = permission ID

### RBAC Roles

#### GET `/api/rbac/roles`

- Purpose: List roles
- Body: `None`

#### POST `/api/rbac/roles`

- Purpose: Create role
- Body:

```json
{
  "name": "teacher",
  "description": "Can manage student records, grades, and related workflows."
}
```

#### GET `/api/rbac/roles/{id}`

- Purpose: Get role by ID
- Path param:
  - `id` = role ID

#### PUT `/api/rbac/roles/{id}`

- Purpose: Update role
- Path param:
  - `id` = role ID
- Body:

```json
{
  "name": "teacher",
  "description": "Can manage student records, grades, and related workflows."
}
```

#### DELETE `/api/rbac/roles/{id}`

- Purpose: Soft delete role
- Path param:
  - `id` = role ID

#### GET `/api/rbac/roles/{roleId}/permissions`

- Purpose: Get role permissions
- Path param:
  - `roleId` = role ID

#### PUT `/api/rbac/roles/{roleId}/permissions`

- Purpose: Replace all permissions of one role
- Path param:
  - `roleId` = role ID
- Body:

```json
{
  "permissionIds": [1, 3, 4, 5, 6, 7]
}
```

### RBAC User Access

#### GET `/api/rbac/users/{userId}/access`

- Purpose: Get combined access profile of a user
- Path param:
  - `userId` = user ID

#### GET `/api/rbac/users/{userId}/roles`

- Purpose: Get roles assigned to a user
- Path param:
  - `userId` = user ID

#### PUT `/api/rbac/users/{userId}/roles`

- Purpose: Replace all user roles
- Path param:
  - `userId` = user ID
- Body:

```json
{
  "roleIds": [2, 3]
}
```

#### GET `/api/rbac/users/{userId}/permissions/overrides`

- Purpose: Get user permission overrides
- Path param:
  - `userId` = user ID

#### PUT `/api/rbac/users/{userId}/permissions/overrides`

- Purpose: Replace user permission overrides
- Path param:
  - `userId` = user ID
- Body:

```json
{
  "overrides": [
    {
      "permissionId": 9,
      "type": "allow"
    },
    {
      "permissionId": 5,
      "type": "deny"
    }
  ]
}
```

## Recommended Postman Requests

If you want a simple smoke flow in Postman, test these first:

1. `GET {{base_url}}/health`
2. `POST {{api_url}}/auth/login`
3. `GET {{api_url}}/users/me`
4. `POST {{api_url}}/auth/logout`
5. `GET {{api_url}}/users/me` again to confirm token is rejected
6. `GET {{api_url}}/uploads/files?category=sql`
7. `GET {{api_url}}/rbac/modules`

## Notes

- Most endpoints under `/api/users`, `/api/uploads`, and `/api/rbac` are protected
- `/api/auth/logout` is also protected
- Upload view is also protected, even if the file exists physically in storage
- User delete and RBAC delete actions are soft delete based
- Upload delete removes the physical file from storage
- Logout currently blacklists the JWT token in server memory, so logged-out tokens are rejected until they expire or until the server restarts
- For the most detailed live reference, open Swagger UI at `http://localhost:5555/docs`
