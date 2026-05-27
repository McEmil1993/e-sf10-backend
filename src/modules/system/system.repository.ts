import { db } from "../../config/db";
import type { SchoolRecord, SchoolRow, UpdateSchoolInput } from "./system.interface";

const baseSchoolSelect = `
  SELECT
    school_id AS schoolId,
    deped_school_id AS depedSchoolId,
    school_name AS schoolName,
    district,
    division,
    region,
    address,
    school_logo AS schoolLogo,
    deped_logo AS depedLogo,
    other_logo AS otherLogo,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM schools
`;

const mapSchool = (row: SchoolRow): SchoolRecord => {
  return {
    schoolId: row.schoolId,
    depedSchoolId: row.depedSchoolId,
    schoolName: row.schoolName,
    district: row.district,
    division: row.division,
    region: row.region,
    address: row.address,
    schoolLogo: row.schoolLogo,
    depedLogo: row.depedLogo,
    otherLogo: row.otherLogo,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
};

export const systemRepository = {
  async getSchool(): Promise<SchoolRecord | null> {
    const [rows] = await db.query<SchoolRow[]>(
      `${baseSchoolSelect} WHERE deleted_at IS NULL ORDER BY school_id ASC LIMIT 1`,
    );
    const school = rows[0];

    return school ? mapSchool(school) : null;
  },

  async updateSchool(schoolId: number, payload: UpdateSchoolInput): Promise<SchoolRecord> {
    await db.execute(
      `
        UPDATE schools
        SET
          deped_school_id = ?,
          school_name = ?,
          district = ?,
          division = ?,
          region = ?,
          address = ?,
          school_logo = ?,
          deped_logo = ?,
          other_logo = ?
        WHERE school_id = ? AND deleted_at IS NULL
      `,
      [
        payload.depedSchoolId,
        payload.schoolName,
        payload.district,
        payload.division,
        payload.region,
        payload.address,
        payload.schoolLogo,
        payload.depedLogo,
        payload.otherLogo,
        schoolId,
      ],
    );

    const updatedSchool = await this.getSchool();

    if (!updatedSchool) {
      throw new Error("Failed to fetch updated school settings.");
    }

    return updatedSchool;
  },
};
