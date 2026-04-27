import type { ResultSetHeader } from "mysql2";

import { db } from "../../config/db";
import type {
  CreatePupilInput,
  PupilRecord,
  PupilRow,
  UpdatePupilInput,
} from "./pupil.interface";

const basePupilSelect = `
  SELECT
    id,
    lrn,
    first_name AS firstName,
    middle_name AS middleName,
    last_name AS lastName,
    suffix,
    sex,
    DATE_FORMAT(birthdate, '%Y-%m-%d') AS birthdate,
    birthplace,
    street_address AS streetAddress,
    barangay,
    city_municipality AS cityMunicipality,
    province,
    region,
    status,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM pupils
`;

const mapPupil = (row: PupilRow): PupilRecord => ({
  id: row.id,
  lrn: row.lrn,
  firstName: row.firstName,
  middleName: row.middleName,
  lastName: row.lastName,
  suffix: row.suffix,
  sex: row.sex,
  birthdate: row.birthdate instanceof Date ? row.birthdate.toISOString().slice(0, 10) : String(row.birthdate),
  birthplace: row.birthplace,
  streetAddress: row.streetAddress,
  barangay: row.barangay,
  cityMunicipality: row.cityMunicipality,
  province: row.province,
  region: row.region,
  status: row.status,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  deletedAt: row.deletedAt,
});

const findOne = async (query: string, values: unknown[]): Promise<PupilRecord | null> => {
  const [rows] = await db.query<PupilRow[]>(query, values);
  const pupil = rows[0];
  return pupil ? mapPupil(pupil) : null;
};

export const pupilRepository = {
  async findAll(): Promise<PupilRecord[]> {
    const [rows] = await db.query<PupilRow[]>(`${basePupilSelect} WHERE deleted_at IS NULL ORDER BY id DESC`);
    return rows.map(mapPupil);
  },

  async findById(pupilId: number): Promise<PupilRecord | null> {
    return findOne(`${basePupilSelect} WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [pupilId]);
  },

  async findByLrn(lrn: string): Promise<PupilRecord | null> {
    return findOne(`${basePupilSelect} WHERE lrn = ? AND deleted_at IS NULL LIMIT 1`, [lrn]);
  },

  async findByLrnIncludingDeleted(lrn: string): Promise<PupilRecord | null> {
    return findOne(`${basePupilSelect} WHERE lrn = ? LIMIT 1`, [lrn]);
  },

  async createPupil(payload: CreatePupilInput): Promise<PupilRecord> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO pupils (
          lrn,
          first_name,
          middle_name,
          last_name,
          suffix,
          sex,
          birthdate,
          birthplace,
          street_address,
          barangay,
          city_municipality,
          province,
          region,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.lrn,
        payload.firstName,
        payload.middleName,
        payload.lastName,
        payload.suffix,
        payload.sex,
        payload.birthdate,
        payload.birthplace,
        payload.streetAddress,
        payload.barangay,
        payload.cityMunicipality,
        payload.province,
        payload.region,
        payload.status,
      ],
    );

    const createdPupil = await this.findById(result.insertId);

    if (!createdPupil) {
      throw new Error("Failed to fetch created pupil.");
    }

    return createdPupil;
  },

  async updatePupil(pupilId: number, payload: UpdatePupilInput): Promise<PupilRecord> {
    await db.execute(
      `
        UPDATE pupils
        SET
          lrn = ?,
          first_name = ?,
          middle_name = ?,
          last_name = ?,
          suffix = ?,
          sex = ?,
          birthdate = ?,
          birthplace = ?,
          street_address = ?,
          barangay = ?,
          city_municipality = ?,
          province = ?,
          region = ?,
          status = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [
        payload.lrn,
        payload.firstName,
        payload.middleName,
        payload.lastName,
        payload.suffix,
        payload.sex,
        payload.birthdate,
        payload.birthplace,
        payload.streetAddress,
        payload.barangay,
        payload.cityMunicipality,
        payload.province,
        payload.region,
        payload.status,
        pupilId,
      ],
    );

    const updatedPupil = await this.findById(pupilId);

    if (!updatedPupil) {
      throw new Error("Failed to fetch updated pupil.");
    }

    return updatedPupil;
  },

  async softDeletePupil(pupilId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE pupils
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
      `,
      [pupilId],
    );

    return result.affectedRows > 0;
  },
};
