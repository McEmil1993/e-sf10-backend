import { HttpError } from "../../common/utils/http-error";
import { db } from "../../config/db";
import type { AcademicEntityDefinition } from "./academic.interface";
import { academicRepository } from "./academic.repository";

const quarterFields = ["quarter1", "quarter2", "quarter3", "quarter4"] as const;

const toFiniteNumber = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
};

const withComputedGradeFields = (definition: AcademicEntityDefinition, payload: Record<string, unknown>) => {
  if (definition.key !== "grades") {
    return payload;
  }

  const nextPayload = { ...payload };
  const quarterValues = quarterFields.map((fieldName) => toFiniteNumber(nextPayload[fieldName]));
  const hasCompleteQuarters = quarterValues.every((value) => value !== null);

  if ((nextPayload.finalRating === null || nextPayload.finalRating === undefined) && hasCompleteQuarters) {
    const total = quarterValues.reduce((sum, value) => sum + (value ?? 0), 0);
    nextPayload.finalRating = Math.round(total / quarterValues.length);
  }

  const finalRating = toFiniteNumber(nextPayload.finalRating);

  if ((nextPayload.remarks === null || nextPayload.remarks === undefined || nextPayload.remarks === "") && finalRating !== null) {
    nextPayload.remarks = finalRating >= 75 ? "PASSED" : "FAILED";
  }

  return nextPayload;
};

const validateTeacherUser = async (payload: Record<string, unknown>) => {
  const userId = toFiniteNumber(payload.userId);

  if (userId === null || !Number.isInteger(userId) || userId <= 0) {
    throw new HttpError(400, "userId must be a valid teacher or school administrator user.");
  }

  const [rows] = await db.query(
    `
      SELECT u.id
      FROM users u
      INNER JOIN positions p
        ON p.deleted_at IS NULL
        AND (
          LOWER(CONVERT(p.acronym USING utf8mb4)) COLLATE utf8mb4_unicode_ci =
            LOWER(CONVERT(u.position USING utf8mb4)) COLLATE utf8mb4_unicode_ci
          OR LOWER(CONVERT(p.full_position USING utf8mb4)) COLLATE utf8mb4_unicode_ci =
            LOWER(CONVERT(u.position USING utf8mb4)) COLLATE utf8mb4_unicode_ci
        )
      WHERE u.id = ?
        AND u.deleted_at IS NULL
        AND u.status = 'active'
        AND LOWER(CONVERT(p.category USING utf8mb4)) COLLATE utf8mb4_unicode_ci
          IN (_utf8mb4'teaching' COLLATE utf8mb4_unicode_ci, _utf8mb4'school administration' COLLATE utf8mb4_unicode_ci)
      LIMIT 1
    `,
    [userId],
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new HttpError(400, "Selected user must have a Teaching or School Administration position.");
  }
};

const prepareAcademicPayload = async (
  definition: AcademicEntityDefinition,
  payload: Record<string, unknown>,
) => {
  const nextPayload = withComputedGradeFields(definition, payload);

  if (definition.key === "teachers") {
    await validateTeacherUser(nextPayload);
  }

  return nextPayload;
};

export const academicService = {
  list(definition: AcademicEntityDefinition) {
    return academicRepository.list(definition);
  },

  async getById(definition: AcademicEntityDefinition, id: number) {
    const record = await academicRepository.findById(definition, id);

    if (!record) {
      throw new HttpError(404, `${definition.label} not found.`);
    }

    return record;
  },

  async create(definition: AcademicEntityDefinition, payload: Record<string, unknown>) {
    return academicRepository.create(definition, await prepareAcademicPayload(definition, payload));
  },

  async update(definition: AcademicEntityDefinition, id: number, payload: Record<string, unknown>) {
    await this.getById(definition, id);
    return academicRepository.update(definition, id, await prepareAcademicPayload(definition, payload));
  },

  async delete(definition: AcademicEntityDefinition, id: number) {
    await this.getById(definition, id);
    await academicRepository.softDelete(definition, id);
  },
};
