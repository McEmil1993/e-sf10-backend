import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "../../config/db";
import type {
  CreateStudentGuardianInput,
  CreateStudentInput,
  StudentGuardianRecord,
  StudentGuardianRow,
  StudentInformationLookupRecord,
  StudentInformationLookupRow,
  StudentInformationLookupType,
  StudentInformationLookupsResponseDto,
  StudentInformationRecord,
  StudentRecord,
  StudentRow,
  UpdateStudentGuardianInput,
  UpdateStudentInput,
} from "./student.interface";

const baseStudentSelect = `
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
  FROM students
`;

const baseStudentGuardianSelect = `
  SELECT
    id,
    studentId,
    guardianId,
    relationship,
    isPrimary,
    guardianFirstName,
    guardianMiddleName,
    guardianLastName,
    guardianSuffix,
    guardianRelationship,
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
  FROM vw_student_guardians
`;

const mapStudent = (row: StudentRow): StudentRecord => ({
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

const mapStudentGuardian = (row: StudentGuardianRow): StudentGuardianRecord => ({
  id: row.id,
  studentId: row.studentId,
  guardianId: row.guardianId,
  relationship: row.relationship,
  isPrimary: Boolean(row.isPrimary),
  guardian: {
    id: row.guardianId,
    firstName: row.guardianFirstName,
    middleName: row.guardianMiddleName,
    lastName: row.guardianLastName,
    suffix: row.guardianSuffix,
    relationship: row.guardianRelationship,
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

const mapLookup = (row: StudentInformationLookupRow): StudentInformationLookupRecord => ({
  id: row.id,
  name: row.name,
  sortOrder: row.sortOrder,
  isActive: Boolean(row.isActive),
});

const findOne = async (query: string, values: unknown[]): Promise<StudentRecord | null> => {
  const [rows] = await db.query<StudentRow[]>(query, values);
  const student = rows[0];
  return student ? mapStudent(student) : null;
};

const lookupTableByType: Record<StudentInformationLookupType, string> = {
  motherTongue: "mother_tongues",
  indigenousGroup: "indigenous_groups",
  religion: "religions",
};

const relationTableByType: Record<StudentInformationLookupType, { tableName: string; lookupColumn: string }> = {
  motherTongue: {
    tableName: "student_mother_tongues",
    lookupColumn: "mother_tongue_id",
  },
  indigenousGroup: {
    tableName: "student_indigenous_groups",
    lookupColumn: "indigenous_group_id",
  },
  religion: {
    tableName: "student_religions",
    lookupColumn: "religion_id",
  },
};

const findLookupById = async (
  type: StudentInformationLookupType,
  lookupId: number,
): Promise<StudentInformationLookupRecord | null> => {
  const tableName = lookupTableByType[type];
  const [rows] = await db.query<StudentInformationLookupRow[]>(
    `
      SELECT
        id,
        name,
        sort_order AS sortOrder,
        is_active AS isActive
      FROM ${tableName}
      WHERE id = ? AND deleted_at IS NULL AND is_active = 1
      LIMIT 1
    `,
    [lookupId],
  );

  return rows[0] ? mapLookup(rows[0]) : null;
};

const findLookupByName = async (
  type: StudentInformationLookupType,
  lookupName: string,
): Promise<StudentInformationLookupRecord | null> => {
  const tableName = lookupTableByType[type];
  const [rows] = await db.query<StudentInformationLookupRow[]>(
    `
      SELECT
        id,
        name,
        sort_order AS sortOrder,
        is_active AS isActive
      FROM ${tableName}
      WHERE LOWER(name) = LOWER(?) AND deleted_at IS NULL
      LIMIT 1
    `,
    [lookupName],
  );

  return rows[0] ? mapLookup(rows[0]) : null;
};

const findStudentInformationLookup = async (
  type: StudentInformationLookupType,
  studentId: number,
): Promise<StudentInformationLookupRecord | null> => {
  const lookupTableName = lookupTableByType[type];
  const relationTable = relationTableByType[type];
  const [rows] = await db.query<StudentInformationLookupRow[]>(
    `
      SELECT
        lookup_table.id,
        lookup_table.name,
        lookup_table.sort_order AS sortOrder,
        lookup_table.is_active AS isActive
      FROM ${relationTable.tableName} relation_table
      INNER JOIN ${lookupTableName} lookup_table
        ON lookup_table.id = relation_table.${relationTable.lookupColumn}
      WHERE relation_table.student_id = ?
        AND relation_table.deleted_at IS NULL
        AND lookup_table.deleted_at IS NULL
      LIMIT 1
    `,
    [studentId],
  );

  return rows[0] ? mapLookup(rows[0]) : null;
};

interface StudentInformationViewRow extends RowDataPacket {
  studentId: number;
  motherTongueId: number | null;
  motherTongueName: string | null;
  motherTongueSortOrder: number | null;
  motherTongueIsActive: number | boolean | null;
  indigenousGroupId: number | null;
  indigenousGroupName: string | null;
  indigenousGroupSortOrder: number | null;
  indigenousGroupIsActive: number | boolean | null;
  religionId: number | null;
  religionName: string | null;
  religionSortOrder: number | null;
  religionIsActive: number | boolean | null;
}

const mapNullableLookupFromView = (
  id: number | null,
  name: string | null,
  sortOrder: number | null,
  isActive: number | boolean | null,
): StudentInformationLookupRecord | null => {
  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    sortOrder: sortOrder ?? 0,
    isActive: Boolean(isActive),
  };
};

export const studentRepository = {
  async getStudentInformationLookups(): Promise<StudentInformationLookupsResponseDto> {
    const selectLookups = async (type: StudentInformationLookupType): Promise<StudentInformationLookupRecord[]> => {
      const tableName = lookupTableByType[type];
      const [rows] = await db.query<StudentInformationLookupRow[]>(
        `
          SELECT
            id,
            name,
            sort_order AS sortOrder,
            is_active AS isActive
          FROM ${tableName}
          WHERE deleted_at IS NULL AND is_active = 1
          ORDER BY sort_order ASC, name ASC
        `,
      );

      return rows.map(mapLookup);
    };

    const [motherTongues, indigenousGroups, religions] = await Promise.all([
      selectLookups("motherTongue"),
      selectLookups("indigenousGroup"),
      selectLookups("religion"),
    ]);

    return {
      motherTongues,
      indigenousGroups,
      religions,
    };
  },

  async findInformationLookupById(
    type: StudentInformationLookupType,
    lookupId: number,
  ): Promise<StudentInformationLookupRecord | null> {
    return findLookupById(type, lookupId);
  },

  async findInformationLookupByName(
    type: StudentInformationLookupType,
    lookupName: string,
  ): Promise<StudentInformationLookupRecord | null> {
    return findLookupByName(type, lookupName);
  },

  async findOrCreateIndigenousGroup(name: string): Promise<StudentInformationLookupRecord> {
    const existingLookup = await findLookupByName("indigenousGroup", name);

    if (existingLookup) {
      return existingLookup;
    }

    const [maxSortRows] = await db.query<RowDataPacket[]>(
      "SELECT COALESCE(MAX(sort_order), 0) AS maxSortOrder FROM indigenous_groups",
    );
    const maxSortOrder = Number(maxSortRows[0]?.maxSortOrder ?? 0);

    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO indigenous_groups (name, sort_order)
        VALUES (?, ?)
      `,
      [name, maxSortOrder + 1],
    );

    const createdLookup = await findLookupById("indigenousGroup", result.insertId);

    if (!createdLookup) {
      throw new Error("Failed to fetch created indigenous group.");
    }

    return createdLookup;
  },

  async getStudentInformation(studentId: number): Promise<StudentInformationRecord> {
    const [rows] = await db.query<StudentInformationViewRow[]>(
      "SELECT * FROM vw_student_information WHERE studentId = ? LIMIT 1",
      [studentId],
    );
    const row = rows[0];

    return {
      studentId,
      motherTongue: row
        ? mapNullableLookupFromView(
            row.motherTongueId,
            row.motherTongueName,
            row.motherTongueSortOrder,
            row.motherTongueIsActive,
          )
        : null,
      indigenousGroup: row
        ? mapNullableLookupFromView(
            row.indigenousGroupId,
            row.indigenousGroupName,
            row.indigenousGroupSortOrder,
            row.indigenousGroupIsActive,
          )
        : null,
      religion: row
        ? mapNullableLookupFromView(
            row.religionId,
            row.religionName,
            row.religionSortOrder,
            row.religionIsActive,
          )
        : null,
    };
  },

  async updateStudentInformation(
    studentId: number,
    payload: {
      motherTongueId?: number | null;
      indigenousGroupId?: number | null;
      religionId?: number | null;
    },
  ): Promise<StudentInformationRecord> {
    const upsertRelation = async (
      type: StudentInformationLookupType,
      lookupId: number | null | undefined,
    ): Promise<void> => {
      if (lookupId === undefined) {
        return;
      }

      const relationTable = relationTableByType[type];

      if (lookupId === null) {
        await db.execute(
          `
            UPDATE ${relationTable.tableName}
            SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE student_id = ? AND deleted_at IS NULL
          `,
          [studentId],
        );
        return;
      }

      await db.execute(
        `
          INSERT INTO ${relationTable.tableName} (student_id, ${relationTable.lookupColumn}, deleted_at)
          VALUES (?, ?, NULL)
          ON DUPLICATE KEY UPDATE
            ${relationTable.lookupColumn} = VALUES(${relationTable.lookupColumn}),
            deleted_at = NULL,
            updated_at = CURRENT_TIMESTAMP
        `,
        [studentId, lookupId],
      );
    };

    await upsertRelation("motherTongue", payload.motherTongueId);
    await upsertRelation("indigenousGroup", payload.indigenousGroupId);
    await upsertRelation("religion", payload.religionId);

    return this.getStudentInformation(studentId);
  },

  async findAll(): Promise<StudentRecord[]> {
    const [rows] = await db.query<StudentRow[]>(`${baseStudentSelect} WHERE deleted_at IS NULL ORDER BY id DESC`);
    return rows.map(mapStudent);
  },

  async findById(studentId: number): Promise<StudentRecord | null> {
    return findOne(`${baseStudentSelect} WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [studentId]);
  },

  async findByLrn(lrn: string): Promise<StudentRecord | null> {
    return findOne(`${baseStudentSelect} WHERE lrn = ? AND deleted_at IS NULL LIMIT 1`, [lrn]);
  },

  async findByLrnIncludingDeleted(lrn: string): Promise<StudentRecord | null> {
    return findOne(`${baseStudentSelect} WHERE lrn = ? LIMIT 1`, [lrn]);
  },

  async createStudent(payload: CreateStudentInput): Promise<StudentRecord> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO students (
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

    const createdStudent = await this.findById(result.insertId);

    if (!createdStudent) {
      throw new Error("Failed to fetch created student.");
    }

    return createdStudent;
  },

  async updateStudent(studentId: number, payload: UpdateStudentInput): Promise<StudentRecord> {
    await db.execute(
      `
        UPDATE students
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
        studentId,
      ],
    );

    const updatedStudent = await this.findById(studentId);

    if (!updatedStudent) {
      throw new Error("Failed to fetch updated student.");
    }

    return updatedStudent;
  },

  async softDeleteStudent(studentId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE students
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
      `,
      [studentId],
    );

    return result.affectedRows > 0;
  },

  async findGuardianRelationsByStudentId(studentId: number): Promise<StudentGuardianRecord[]> {
    const [rows] = await db.query<StudentGuardianRow[]>(
      `
        ${baseStudentGuardianSelect}
        WHERE studentId = ?
        ORDER BY isPrimary DESC, guardianLastName ASC, guardianFirstName ASC, id DESC
      `,
      [studentId],
    );

    return rows.map(mapStudentGuardian);
  },

  async findGuardianRelationById(relationId: number): Promise<StudentGuardianRecord | null> {
    const [rows] = await db.query<StudentGuardianRow[]>(
      `${baseStudentGuardianSelect} WHERE id = ? LIMIT 1`,
      [relationId],
    );

    const relation = rows[0];
    return relation ? mapStudentGuardian(relation) : null;
  },

  async findGuardianRelationByStudentAndGuardianId(
    studentId: number,
    guardianId: number,
  ): Promise<StudentGuardianRecord | null> {
    const [rows] = await db.query<StudentGuardianRow[]>(
      `${baseStudentGuardianSelect} WHERE studentId = ? AND guardianId = ? LIMIT 1`,
      [studentId, guardianId],
    );

    const relation = rows[0];
    return relation ? mapStudentGuardian(relation) : null;
  },

  async createGuardianRelation(
    studentId: number,
    payload: CreateStudentGuardianInput,
  ): Promise<StudentGuardianRecord> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [relationCountRows] = await connection.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS totalCount FROM student_guardians WHERE student_id = ? AND deleted_at IS NULL",
        [studentId],
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
              relationship,
              contact_number,
              address,
              barangay,
              municipality_city,
              province,
              region,
              profile_picture
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            payload.firstName ?? "",
            payload.middleName ?? null,
            payload.lastName ?? "",
            payload.suffix ?? null,
            payload.relationship,
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
            UPDATE student_guardians
            SET is_primary = 0, updated_at = CURRENT_TIMESTAMP
            WHERE student_id = ? AND deleted_at IS NULL
          `,
          [studentId],
        );
      }

      const [relationResult] = await connection.execute<ResultSetHeader>(
        `
          INSERT INTO student_guardians (
            student_id,
            guardian_id,
            relationship,
            is_primary
          )
          VALUES (?, ?, ?, ?)
        `,
        [
          studentId,
          guardianId,
          payload.relationship,
          shouldSetPrimary ? 1 : 0,
        ],
      );

      await connection.commit();

      const createdRelation = await this.findGuardianRelationById(relationResult.insertId);

      if (!createdRelation) {
        throw new Error("Failed to fetch created student guardian relation.");
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
    studentId: number,
    relationId: number,
    payload: UpdateStudentGuardianInput,
  ): Promise<StudentGuardianRecord> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [currentRows] = await connection.query<RowDataPacket[]>(
        `
          SELECT id, is_primary AS isPrimary
          FROM student_guardians
          WHERE id = ? AND student_id = ? AND deleted_at IS NULL
          LIMIT 1
        `,
        [relationId, studentId],
      );

      const currentRelation = currentRows[0];

      if (!currentRelation) {
        throw new Error("Student guardian relation not found.");
      }

      const [otherRelationRows] = await connection.query<RowDataPacket[]>(
        `
          SELECT id
          FROM student_guardians
          WHERE student_id = ? AND id <> ? AND deleted_at IS NULL
          ORDER BY is_primary DESC, created_at ASC, id ASC
        `,
        [studentId, relationId],
      );

      const hasOtherRelations = otherRelationRows.length > 0;
      const shouldSetPrimary = payload.isPrimary || !hasOtherRelations;

      if (shouldSetPrimary) {
        await connection.execute(
          `
            UPDATE student_guardians
            SET is_primary = 0, updated_at = CURRENT_TIMESTAMP
            WHERE student_id = ? AND id <> ? AND deleted_at IS NULL
          `,
          [studentId, relationId],
        );
      }

      await connection.execute(
        `
          UPDATE student_guardians
          SET
            relationship = ?,
            is_primary = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND student_id = ? AND deleted_at IS NULL
        `,
        [
          payload.relationship,
          shouldSetPrimary ? 1 : 0,
          relationId,
          studentId,
        ],
      );

      const replacementPrimaryRelation = otherRelationRows[0];

      if (!shouldSetPrimary && Boolean(currentRelation.isPrimary) && hasOtherRelations && replacementPrimaryRelation) {
        await connection.execute(
          `
            UPDATE student_guardians
            SET is_primary = 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [replacementPrimaryRelation.id],
        );
      }

      await connection.commit();

      const updatedRelation = await this.findGuardianRelationById(relationId);

      if (!updatedRelation) {
        throw new Error("Failed to fetch updated student guardian relation.");
      }

      return updatedRelation;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async softDeleteGuardianRelation(studentId: number, relationId: number): Promise<void> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [currentRows] = await connection.query<RowDataPacket[]>(
        `
          SELECT id, is_primary AS isPrimary
          FROM student_guardians
          WHERE id = ? AND student_id = ? AND deleted_at IS NULL
          LIMIT 1
        `,
        [relationId, studentId],
      );

      const currentRelation = currentRows[0];

      if (!currentRelation) {
        throw new Error("Student guardian relation not found.");
      }

      const [fallbackRows] = await connection.query<RowDataPacket[]>(
        `
          SELECT id
          FROM student_guardians
          WHERE student_id = ? AND id <> ? AND deleted_at IS NULL
          ORDER BY is_primary DESC, created_at ASC, id ASC
          LIMIT 1
        `,
        [studentId, relationId],
      );

      await connection.execute(
        `
          UPDATE student_guardians
          SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND student_id = ? AND deleted_at IS NULL
        `,
        [relationId, studentId],
      );

      if (Boolean(currentRelation.isPrimary) && fallbackRows[0]?.id) {
        await connection.execute(
          `
            UPDATE student_guardians
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
