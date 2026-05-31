import { HttpError } from "../../common/utils/http-error";
import { db } from "../../config/db";
import { academicEntityDefinitions } from "./academic.definitions";
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

const isTruthyBooleanValue = (value: unknown) => value === true || value === 1 || value === "1" || value === "true";

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

const createTeacherRecord = async (
  definition: AcademicEntityDefinition,
  payload: Record<string, unknown>,
) => {
  const preparedPayload = await prepareAcademicPayload(definition, payload);
  const userId = toFiniteNumber(preparedPayload.userId);

  if (userId === null) {
    throw new HttpError(400, "userId must be a valid teacher or school administrator user.");
  }

  const existingTeacher = await academicRepository.findTeacherByUserId(definition, userId, true);

  if (existingTeacher && !existingTeacher.deletedAt) {
    throw new HttpError(400, "Selected user is already a teacher or adviser.");
  }

  if (existingTeacher) {
    const restoredTeacher = await academicRepository.restoreTeacherByUserId(definition, userId);

    if (!restoredTeacher) {
      throw new Error("Failed to restore teacher or adviser.");
    }

    return restoredTeacher;
  }

  return academicRepository.create(definition, preparedPayload);
};

const validateSchoolYearUpdate = async (
  payload: Record<string, unknown>,
  currentRecord?: Record<string, unknown> | null,
) => {
  if (!currentRecord || !("isActive" in payload) || isTruthyBooleanValue(payload.isActive)) {
    return;
  }

  const wasActive = isTruthyBooleanValue(currentRecord.isActive);

  if (!wasActive) {
    return;
  }

  const otherActiveSchoolYears = await academicRepository.countOtherActiveSchoolYears(Number(currentRecord.id));

  if (otherActiveSchoolYears === 0) {
    throw new HttpError(400, "Activate another school year before deactivating the current active school year.");
  }
};

const syncActiveSchoolYear = async (record: Record<string, unknown>) => {
  const recordId = toFiniteNumber(record.id);

  if (recordId === null || !isTruthyBooleanValue(record.isActive)) {
    return record;
  }

  await academicRepository.deactivateOtherSchoolYears(recordId);
  const syncedRecord = await academicRepository.findById(academicEntityDefinitions["school-years"], recordId);
  return syncedRecord ?? record;
};

const activeEnrollmentStatuses = new Set(["enrolled", "transferred_in"]);
const enrollmentStatuses = new Set(["enrolled", "transferred_in", "transferred_out", "dropped", "completed"]);
const admissionTypes = new Set(["continuing", "new_learner", "transferee_in", "balik_aral", "returning"]);
const completionStatuses = new Set(["not_applicable", "promoted", "retained"]);

const validateSection = async (
  payload: Record<string, unknown>,
  currentRecordId?: number | null,
) => {
  const schoolYearId = toFiniteNumber(payload.schoolYearId);
  const gradeLevel = toFiniteNumber(payload.gradeLevel);
  const adviserId = toFiniteNumber(payload.adviserId);
  const capacityLimit = toFiniteNumber(payload.capacityLimit);

  if (schoolYearId === null || !Number.isInteger(schoolYearId) || schoolYearId <= 0) {
    throw new HttpError(400, "schoolYearId must be a valid school year.");
  }

  if (gradeLevel === null || !Number.isInteger(gradeLevel) || gradeLevel < 1 || gradeLevel > 6) {
    throw new HttpError(400, "gradeLevel must be Grade 1 to Grade 6.");
  }

  if (payload.capacityLimit !== null && payload.capacityLimit !== undefined && payload.capacityLimit !== "") {
    if (capacityLimit === null || !Number.isInteger(capacityLimit) || capacityLimit <= 0) {
      throw new HttpError(400, "capacityLimit must be a positive whole number.");
    }
  }

  const [schoolYearRows] = await db.query(
    `
      SELECT id
      FROM school_years
      WHERE id = ? AND deleted_at IS NULL
      LIMIT 1
    `,
    [schoolYearId],
  );

  if (!Array.isArray(schoolYearRows) || schoolYearRows.length === 0) {
    throw new HttpError(400, "Selected school year was not found.");
  }

  if (payload.adviserId !== null && payload.adviserId !== undefined && payload.adviserId !== "") {
    if (adviserId === null || !Number.isInteger(adviserId) || adviserId <= 0) {
      throw new HttpError(400, "adviserId must be a valid teacher or adviser.");
    }

    const [teacherRows] = await db.query(
      `
        SELECT t.id
        FROM teachers t
        INNER JOIN users u
          ON u.id = t.user_id
          AND u.deleted_at IS NULL
          AND u.status = 'active'
        WHERE t.id = ? AND t.deleted_at IS NULL
        LIMIT 1
      `,
      [adviserId],
    );

    if (!Array.isArray(teacherRows) || teacherRows.length === 0) {
      throw new HttpError(400, "Selected adviser was not found.");
    }

    const [assignedSectionRows] = await db.query(
      `
        SELECT id
        FROM sections
        WHERE adviser_id = ?
          AND deleted_at IS NULL
          AND (? IS NULL OR id <> ?)
        LIMIT 1
      `,
      [adviserId, currentRecordId ?? null, currentRecordId ?? null],
    );

    if (Array.isArray(assignedSectionRows) && assignedSectionRows.length > 0) {
      throw new HttpError(400, "Selected adviser is already assigned to another section.");
    }
  }
};

const validateEnrollment = async (
  payload: Record<string, unknown>,
  currentRecordId?: number | null,
) => {
  const studentId = toFiniteNumber(payload.studentId);
  const schoolYearId = toFiniteNumber(payload.schoolYearId);
  const sectionId = toFiniteNumber(payload.sectionId);
  const previousGradeLevel = toFiniteNumber(payload.previousGradeLevel);
  const admissionType =
    typeof payload.admissionType === "string" && payload.admissionType.trim()
      ? payload.admissionType.trim()
      : "continuing";
  const status = typeof payload.status === "string" && payload.status.trim() ? payload.status.trim() : "enrolled";
  const completionStatus =
    typeof payload.completionStatus === "string" && payload.completionStatus.trim()
      ? payload.completionStatus.trim()
      : "not_applicable";

  if (studentId === null || !Number.isInteger(studentId) || studentId <= 0) {
    throw new HttpError(400, "studentId must be a valid student.");
  }

  if (schoolYearId === null || !Number.isInteger(schoolYearId) || schoolYearId <= 0) {
    throw new HttpError(400, "schoolYearId must be a valid school year.");
  }

  if (sectionId === null || !Number.isInteger(sectionId) || sectionId <= 0) {
    throw new HttpError(400, "sectionId must be a valid section.");
  }

  if (!admissionTypes.has(admissionType)) {
    throw new HttpError(400, "admissionType must be continuing, new_learner, transferee_in, balik_aral, or returning.");
  }

  if (!enrollmentStatuses.has(status)) {
    throw new HttpError(400, "status must be enrolled, transferred_in, transferred_out, dropped, or completed.");
  }

  if (!completionStatuses.has(completionStatus)) {
    throw new HttpError(400, "completionStatus must be not_applicable, promoted, or retained.");
  }

  if (
    payload.previousGradeLevel !== null &&
    payload.previousGradeLevel !== undefined &&
    payload.previousGradeLevel !== "" &&
    (previousGradeLevel === null || !Number.isInteger(previousGradeLevel) || previousGradeLevel < 1 || previousGradeLevel > 6)
  ) {
    throw new HttpError(400, "previousGradeLevel must be Grade 1 to Grade 6.");
  }

  const [studentRows] = await db.query(
    `
      SELECT id
      FROM students
      WHERE id = ? AND deleted_at IS NULL AND status = 'active'
      LIMIT 1
    `,
    [studentId],
  );

  if (!Array.isArray(studentRows) || studentRows.length === 0) {
    throw new HttpError(400, "Selected student must be active.");
  }

  const [schoolYearRows] = await db.query(
    `
      SELECT id
      FROM school_years
      WHERE id = ? AND deleted_at IS NULL
      LIMIT 1
    `,
    [schoolYearId],
  );

  if (!Array.isArray(schoolYearRows) || schoolYearRows.length === 0) {
    throw new HttpError(400, "Selected school year was not found.");
  }

  const [sectionRows] = await db.query(
    `
      SELECT id, school_year_id AS schoolYearId, capacity_limit AS capacityLimit
      FROM sections
      WHERE id = ? AND deleted_at IS NULL
      LIMIT 1
    `,
    [sectionId],
  );

  if (!Array.isArray(sectionRows) || sectionRows.length === 0) {
    throw new HttpError(400, "Selected section was not found.");
  }

  const section = sectionRows[0] as {
    schoolYearId: number;
    capacityLimit: number | null;
  };

  if (Number(section.schoolYearId) !== schoolYearId) {
    throw new HttpError(400, "Selected section does not belong to the selected school year.");
  }

  const [duplicateRows] = await db.query(
    `
      SELECT id
      FROM enrollments
      WHERE student_id = ?
        AND school_year_id = ?
        AND deleted_at IS NULL
        AND (? IS NULL OR id <> ?)
      LIMIT 1
    `,
    [studentId, schoolYearId, currentRecordId ?? null, currentRecordId ?? null],
  );

  if (Array.isArray(duplicateRows) && duplicateRows.length > 0) {
    throw new HttpError(400, "Student already has an enrollment for this school year.");
  }

  if (activeEnrollmentStatuses.has(status) && section.capacityLimit !== null) {
    const [countRows] = await db.query(
      `
        SELECT COUNT(*) AS total
        FROM enrollments
        WHERE section_id = ?
          AND deleted_at IS NULL
          AND status IN ('enrolled', 'transferred_in')
          AND (? IS NULL OR id <> ?)
      `,
      [sectionId, currentRecordId ?? null, currentRecordId ?? null],
    );

    const total = Array.isArray(countRows) ? Number((countRows[0] as { total?: number })?.total ?? 0) : 0;

    if (total >= Number(section.capacityLimit)) {
      throw new HttpError(400, "Selected section has reached its student limit.");
    }
  }
};

const prepareAcademicPayload = async (
  definition: AcademicEntityDefinition,
  payload: Record<string, unknown>,
  currentRecord?: Record<string, unknown> | null,
) => {
  const nextPayload = withComputedGradeFields(definition, payload);
  const validationPayload = currentRecord ? { ...currentRecord, ...nextPayload } : nextPayload;

  if (definition.key === "school-years") {
    await validateSchoolYearUpdate(nextPayload, currentRecord);
  }

  if (definition.key === "teachers") {
    await validateTeacherUser(validationPayload);
  }

  if (definition.key === "sections") {
    await validateSection(validationPayload, currentRecord ? Number(currentRecord.id) : null);
  }

  if (definition.key === "enrollments") {
    await validateEnrollment(validationPayload, currentRecord ? Number(currentRecord.id) : null);
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
    if (definition.key === "teachers") {
      return createTeacherRecord(definition, payload);
    }

    const record = await academicRepository.create(definition, await prepareAcademicPayload(definition, payload));

    if (definition.key === "school-years") {
      return syncActiveSchoolYear(record);
    }

    return record;
  },

  async update(definition: AcademicEntityDefinition, id: number, payload: Record<string, unknown>) {
    const existingRecord = await this.getById(definition, id);
    const record = await academicRepository.update(definition, id, await prepareAcademicPayload(definition, payload, existingRecord));

    if (definition.key === "school-years") {
      return syncActiveSchoolYear(record);
    }

    return record;
  },

  async delete(definition: AcademicEntityDefinition, id: number) {
    const existingRecord = await this.getById(definition, id);

    if (definition.key === "school-years" && isTruthyBooleanValue(existingRecord.isActive)) {
      const otherActiveSchoolYears = await academicRepository.countOtherActiveSchoolYears(id);

      if (otherActiveSchoolYears === 0) {
        throw new HttpError(400, "Activate another school year before deleting the current active school year.");
      }
    }

    await academicRepository.softDelete(definition, id);
  },
};
