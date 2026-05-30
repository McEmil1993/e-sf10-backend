import type { ResultSetHeader } from "mysql2";

import { db } from "../../config/db";
import type {
  CreateSubjectInput,
  SubjectRecord,
  SubjectRow,
  UpdateSubjectInput,
} from "./subject.interface";

const baseSubjectSelect = `
  SELECT
    id,
    name,
    subject_group AS subjectGroup,
    grade_levels AS gradeLevels,
    is_optional AS isOptional,
    sort_order AS sortOrder,
    is_active AS isActive,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM subjects
`;

function normalizeGradeLevels(value: SubjectRow["gradeLevels"]): number[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is number => Number.isInteger(item));
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item >= 1 && item <= 6);
  } catch {
    return [];
  }
}

const mapSubject = (row: SubjectRow): SubjectRecord => {
  return {
    id: row.id,
    name: row.name,
    subjectGroup: row.subjectGroup,
    gradeLevels: normalizeGradeLevels(row.gradeLevels),
    isOptional: Boolean(row.isOptional),
    sortOrder: row.sortOrder,
    isActive: Boolean(row.isActive),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
};

const findOne = async (query: string, values: unknown[]): Promise<SubjectRecord | null> => {
  const [rows] = await db.query<SubjectRow[]>(query, values);
  const subject = rows[0];

  return subject ? mapSubject(subject) : null;
};

export const subjectRepository = {
  async findAll(): Promise<SubjectRecord[]> {
    const [rows] = await db.query<SubjectRow[]>(
      `${baseSubjectSelect} WHERE deleted_at IS NULL ORDER BY sort_order ASC, id ASC`,
    );

    return rows.map(mapSubject);
  },

  async findById(subjectId: number): Promise<SubjectRecord | null> {
    return findOne(`${baseSubjectSelect} WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [subjectId]);
  },

  async createSubject(payload: CreateSubjectInput): Promise<SubjectRecord> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO subjects (
          name,
          subject_group,
          grade_levels,
          is_optional,
          sort_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        payload.name,
        payload.subjectGroup,
        JSON.stringify(payload.gradeLevels),
        payload.isOptional ? 1 : 0,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
      ],
    );

    const createdSubject = await this.findById(result.insertId);

    if (!createdSubject) {
      throw new Error("Failed to fetch created subject.");
    }

    return createdSubject;
  },

  async updateSubject(subjectId: number, payload: UpdateSubjectInput): Promise<SubjectRecord> {
    await db.execute(
      `
        UPDATE subjects
        SET
          name = ?,
          subject_group = ?,
          grade_levels = ?,
          is_optional = ?,
          sort_order = ?,
          is_active = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [
        payload.name,
        payload.subjectGroup,
        JSON.stringify(payload.gradeLevels),
        payload.isOptional ? 1 : 0,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        subjectId,
      ],
    );

    const updatedSubject = await this.findById(subjectId);

    if (!updatedSubject) {
      throw new Error("Failed to fetch updated subject.");
    }

    return updatedSubject;
  },

  async softDeleteSubject(subjectId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE subjects
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
      `,
      [subjectId],
    );

    return result.affectedRows > 0;
  },
};
