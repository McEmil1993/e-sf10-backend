import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "../../config/db";
import type {
  CreatePupilGuardianInput,
  CreatePupilInput,
  PupilGuardianRecord,
  PupilGuardianRow,
  PupilRecord,
  PupilRow,
  UpdatePupilGuardianInput,
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
    profile_picture AS profilePicture,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM pupils
`;

const basePupilGuardianSelect = `
  SELECT
    id,
    pupilId,
    guardianId,
    relationship,
    isPrimary,
    guardianFirstName,
    guardianMiddleName,
    guardianLastName,
    guardianSuffix,
    guardianContactNumber,
    guardianAddress,
    guardianBarangay,
    guardianMunicipalityCity,
    guardianProvince,
    guardianRegion,
    guardianProfilePicture,
    guardianCreatedAt,
    guardianUpdatedAt,
    guardianDeletedAt,
    createdAt,
    updatedAt,
    deletedAt
  FROM vw_pupil_guardians
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
  profilePicture: row.profilePicture,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  deletedAt: row.deletedAt,
});

const mapPupilGuardian = (row: PupilGuardianRow): PupilGuardianRecord => ({
  id: row.id,
  pupilId: row.pupilId,
  guardianId: row.guardianId,
  relationship: row.relationship,
  isPrimary: Boolean(row.isPrimary),
  guardian: {
    id: row.guardianId,
    firstName: row.guardianFirstName,
    middleName: row.guardianMiddleName,
    lastName: row.guardianLastName,
    suffix: row.guardianSuffix,
    contactNumber: row.guardianContactNumber,
    address: row.guardianAddress,
    barangay: row.guardianBarangay,
    municipalityCity: row.guardianMunicipalityCity,
    province: row.guardianProvince,
    region: row.guardianRegion,
    profilePicture: row.guardianProfilePicture,
    createdAt: row.guardianCreatedAt,
    updatedAt: row.guardianUpdatedAt,
    deletedAt: row.guardianDeletedAt,
  },
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
          status,
          profile_picture
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        payload.profilePicture,
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
          status = ?,
          profile_picture = ?
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
        payload.profilePicture,
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

  async findGuardianRelationsByPupilId(pupilId: number): Promise<PupilGuardianRecord[]> {
    const [rows] = await db.query<PupilGuardianRow[]>(
      `
        ${basePupilGuardianSelect}
        WHERE pupilId = ?
        ORDER BY isPrimary DESC, guardianLastName ASC, guardianFirstName ASC, id DESC
      `,
      [pupilId],
    );

    return rows.map(mapPupilGuardian);
  },

  async findGuardianRelationById(relationId: number): Promise<PupilGuardianRecord | null> {
    const [rows] = await db.query<PupilGuardianRow[]>(
      `${basePupilGuardianSelect} WHERE id = ? LIMIT 1`,
      [relationId],
    );

    const relation = rows[0];
    return relation ? mapPupilGuardian(relation) : null;
  },

  async findGuardianRelationByPupilAndGuardianId(
    pupilId: number,
    guardianId: number,
  ): Promise<PupilGuardianRecord | null> {
    const [rows] = await db.query<PupilGuardianRow[]>(
      `${basePupilGuardianSelect} WHERE pupilId = ? AND guardianId = ? LIMIT 1`,
      [pupilId, guardianId],
    );

    const relation = rows[0];
    return relation ? mapPupilGuardian(relation) : null;
  },

  async createGuardianRelation(
    pupilId: number,
    payload: CreatePupilGuardianInput,
  ): Promise<PupilGuardianRecord> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [relationCountRows] = await connection.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS totalCount FROM pupil_guardians WHERE pupil_id = ? AND deleted_at IS NULL",
        [pupilId],
      );

      const existingRelationCount = Number(relationCountRows[0]?.totalCount ?? 0);
      const shouldSetPrimary = payload.isPrimary || existingRelationCount === 0;
      let guardianId = payload.guardianId ?? null;

      if (!guardianId) {
        const [guardianResult] = await connection.execute<ResultSetHeader>(
          `
            INSERT INTO guardians (
              firstname,
              middlename,
              lastname,
              suffix,
              contact_number,
              address,
              barangay,
              municipality_city,
              province,
              region,
              profile_picture
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            payload.firstName ?? "",
            payload.middleName ?? null,
            payload.lastName ?? "",
            payload.suffix ?? null,
            payload.contactNumber ?? "",
            payload.address ?? "",
            payload.barangay ?? "",
            payload.municipalityCity ?? "",
            payload.province ?? "",
            payload.region ?? "",
            payload.profilePicture ?? null,
          ],
        );

        guardianId = guardianResult.insertId;
      }

      if (shouldSetPrimary) {
        await connection.execute(
          `
            UPDATE pupil_guardians
            SET is_primary = 0, updated_at = CURRENT_TIMESTAMP
            WHERE pupil_id = ? AND deleted_at IS NULL
          `,
          [pupilId],
        );
      }

      const [relationResult] = await connection.execute<ResultSetHeader>(
        `
          INSERT INTO pupil_guardians (
            pupil_id,
            guardian_id,
            relationship,
            is_primary
          )
          VALUES (?, ?, ?, ?)
        `,
        [
          pupilId,
          guardianId,
          payload.relationship,
          shouldSetPrimary ? 1 : 0,
        ],
      );

      await connection.commit();

      const createdRelation = await this.findGuardianRelationById(relationResult.insertId);

      if (!createdRelation) {
        throw new Error("Failed to fetch created pupil guardian relation.");
      }

      return createdRelation;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async updateGuardianRelation(
    pupilId: number,
    relationId: number,
    payload: UpdatePupilGuardianInput,
  ): Promise<PupilGuardianRecord> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [currentRows] = await connection.query<RowDataPacket[]>(
        `
          SELECT id, is_primary AS isPrimary
          FROM pupil_guardians
          WHERE id = ? AND pupil_id = ? AND deleted_at IS NULL
          LIMIT 1
        `,
        [relationId, pupilId],
      );

      const currentRelation = currentRows[0];

      if (!currentRelation) {
        throw new Error("Pupil guardian relation not found.");
      }

      const [otherRelationRows] = await connection.query<RowDataPacket[]>(
        `
          SELECT id
          FROM pupil_guardians
          WHERE pupil_id = ? AND id <> ? AND deleted_at IS NULL
          ORDER BY is_primary DESC, created_at ASC, id ASC
        `,
        [pupilId, relationId],
      );

      const hasOtherRelations = otherRelationRows.length > 0;
      const shouldSetPrimary = payload.isPrimary || !hasOtherRelations;

      if (shouldSetPrimary) {
        await connection.execute(
          `
            UPDATE pupil_guardians
            SET is_primary = 0, updated_at = CURRENT_TIMESTAMP
            WHERE pupil_id = ? AND id <> ? AND deleted_at IS NULL
          `,
          [pupilId, relationId],
        );
      }

      await connection.execute(
        `
          UPDATE pupil_guardians
          SET
            relationship = ?,
            is_primary = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND pupil_id = ? AND deleted_at IS NULL
        `,
        [
          payload.relationship,
          shouldSetPrimary ? 1 : 0,
          relationId,
          pupilId,
        ],
      );

      if (!shouldSetPrimary && Boolean(currentRelation.isPrimary) && hasOtherRelations) {
        await connection.execute(
          `
            UPDATE pupil_guardians
            SET is_primary = 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [otherRelationRows[0].id],
        );
      }

      await connection.commit();

      const updatedRelation = await this.findGuardianRelationById(relationId);

      if (!updatedRelation) {
        throw new Error("Failed to fetch updated pupil guardian relation.");
      }

      return updatedRelation;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async softDeleteGuardianRelation(pupilId: number, relationId: number): Promise<void> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [currentRows] = await connection.query<RowDataPacket[]>(
        `
          SELECT id, is_primary AS isPrimary
          FROM pupil_guardians
          WHERE id = ? AND pupil_id = ? AND deleted_at IS NULL
          LIMIT 1
        `,
        [relationId, pupilId],
      );

      const currentRelation = currentRows[0];

      if (!currentRelation) {
        throw new Error("Pupil guardian relation not found.");
      }

      const [fallbackRows] = await connection.query<RowDataPacket[]>(
        `
          SELECT id
          FROM pupil_guardians
          WHERE pupil_id = ? AND id <> ? AND deleted_at IS NULL
          ORDER BY is_primary DESC, created_at ASC, id ASC
          LIMIT 1
        `,
        [pupilId, relationId],
      );

      await connection.execute(
        `
          UPDATE pupil_guardians
          SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND pupil_id = ? AND deleted_at IS NULL
        `,
        [relationId, pupilId],
      );

      if (Boolean(currentRelation.isPrimary) && fallbackRows[0]?.id) {
        await connection.execute(
          `
            UPDATE pupil_guardians
            SET is_primary = 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [fallbackRows[0].id],
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};
