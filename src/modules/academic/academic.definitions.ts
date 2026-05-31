import type { AcademicEntityDefinition } from "./academic.interface";

export const academicEntityDefinitions = {
  "school-years": {
    key: "school-years",
    tableName: "school_years",
    idColumn: "id",
    label: "School year",
    orderBy: "is_active DESC, name DESC, id DESC",
    fields: [
      { requestKey: "name", columnName: "name", type: "string", required: true },
      { requestKey: "startDate", columnName: "start_date", type: "date", nullable: true },
      { requestKey: "endDate", columnName: "end_date", type: "date", nullable: true },
      { requestKey: "isActive", columnName: "is_active", type: "boolean", defaultValue: true },
    ],
  },
  teachers: {
    key: "teachers",
    tableName: "teachers",
    idColumn: "id",
    label: "Teacher",
    orderBy: "u.last_name ASC, u.first_name ASC, base.id ASC",
    joins: "INNER JOIN users u ON u.id = base.user_id AND u.deleted_at IS NULL",
    fields: [
      { requestKey: "userId", columnName: "user_id", type: "number", required: true },
    ],
    virtualFields: [
      {
        requestKey: "teacherName",
        selectSql:
          "COALESCE(NULLIF(TRIM(u.name), ''), NULLIF(TRIM(CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name, u.suffix)), ''), u.email)",
        type: "string",
      },
      { requestKey: "email", selectSql: "u.email", type: "string" },
      { requestKey: "username", selectSql: "u.username", type: "string" },
      { requestKey: "position", selectSql: "u.position", type: "string" },
    ],
  },
  sections: {
    key: "sections",
    tableName: "sections",
    idColumn: "id",
    label: "Section",
    orderBy: "base.grade_level ASC, base.section_name ASC, base.id ASC",
    joins: `
      LEFT JOIN school_years sy ON sy.id = base.school_year_id AND sy.deleted_at IS NULL
      LEFT JOIN teachers t ON t.id = base.adviser_id AND t.deleted_at IS NULL
      LEFT JOIN users adviser_user ON adviser_user.id = t.user_id AND adviser_user.deleted_at IS NULL
    `,
    fields: [
      { requestKey: "schoolYearId", columnName: "school_year_id", type: "number", required: true },
      { requestKey: "gradeLevel", columnName: "grade_level", type: "number", required: true },
      { requestKey: "sectionName", columnName: "section_name", type: "string", required: true },
      { requestKey: "adviserId", columnName: "adviser_id", type: "number", nullable: true },
      { requestKey: "capacityLimit", columnName: "capacity_limit", type: "number", nullable: true },
    ],
    virtualFields: [
      { requestKey: "schoolYearName", selectSql: "sy.name", type: "string" },
      { requestKey: "schoolYearIsActive", selectSql: "sy.is_active", type: "boolean" },
      {
        requestKey: "adviserName",
        selectSql:
          "COALESCE(NULLIF(TRIM(adviser_user.name), ''), NULLIF(TRIM(CONCAT_WS(' ', adviser_user.first_name, adviser_user.middle_name, adviser_user.last_name, adviser_user.suffix)), ''), adviser_user.email)",
        type: "string",
      },
    ],
  },
  enrollments: {
    key: "enrollments",
    tableName: "enrollments",
    idColumn: "id",
    label: "Enrollment",
    orderBy: "sy.name DESC, sec.grade_level ASC, studentName ASC, base.id DESC",
    joins: `
      INNER JOIN students s ON s.id = base.student_id AND s.deleted_at IS NULL
      INNER JOIN school_years sy ON sy.id = base.school_year_id AND sy.deleted_at IS NULL
      INNER JOIN sections sec ON sec.id = base.section_id AND sec.deleted_at IS NULL
      LEFT JOIN teachers t ON t.id = sec.adviser_id AND t.deleted_at IS NULL
      LEFT JOIN users adviser_user ON adviser_user.id = t.user_id AND adviser_user.deleted_at IS NULL
    `,
    fields: [
      { requestKey: "studentId", columnName: "student_id", type: "number", required: true },
      { requestKey: "schoolYearId", columnName: "school_year_id", type: "number", required: true },
      { requestKey: "sectionId", columnName: "section_id", type: "number", required: true },
      { requestKey: "admissionType", columnName: "admission_type", type: "string", defaultValue: "continuing" },
      { requestKey: "status", columnName: "status", type: "string", defaultValue: "enrolled" },
      { requestKey: "enrollmentDate", columnName: "enrollment_date", type: "date", nullable: true },
      { requestKey: "completionStatus", columnName: "completion_status", type: "string", defaultValue: "not_applicable" },
      { requestKey: "previousSchoolName", columnName: "previous_school_name", type: "string", nullable: true },
      { requestKey: "previousSchoolIdText", columnName: "previous_school_id_text", type: "string", nullable: true },
      { requestKey: "previousGradeLevel", columnName: "previous_grade_level", type: "number", nullable: true },
      { requestKey: "transferInDate", columnName: "transfer_in_date", type: "date", nullable: true },
      { requestKey: "documentsSubmitted", columnName: "documents_submitted", type: "string", nullable: true },
      { requestKey: "remarks", columnName: "remarks", type: "string", nullable: true },
    ],
    virtualFields: [
      {
        requestKey: "studentName",
        selectSql: "NULLIF(TRIM(CONCAT_WS(' ', s.first_name, s.middle_name, s.last_name, s.suffix)), '')",
        type: "string",
      },
      { requestKey: "lrn", selectSql: "s.lrn", type: "string" },
      { requestKey: "birthdate", selectSql: "s.birthdate", type: "date" },
      { requestKey: "profilePicture", selectSql: "s.profile_picture", type: "string" },
      { requestKey: "schoolYearName", selectSql: "sy.name", type: "string" },
      { requestKey: "schoolYearIsActive", selectSql: "sy.is_active", type: "boolean" },
      { requestKey: "sectionName", selectSql: "sec.section_name", type: "string" },
      { requestKey: "gradeLevel", selectSql: "sec.grade_level", type: "number" },
      { requestKey: "gradeSection", selectSql: "CONCAT('Grade ', sec.grade_level, ' - ', sec.section_name)", type: "string" },
      { requestKey: "capacityLimit", selectSql: "sec.capacity_limit", type: "number" },
      {
        requestKey: "adviserName",
        selectSql:
          "COALESCE(NULLIF(TRIM(adviser_user.name), ''), NULLIF(TRIM(CONCAT_WS(' ', adviser_user.first_name, adviser_user.middle_name, adviser_user.last_name, adviser_user.suffix)), ''), adviser_user.email)",
        type: "string",
      },
    ],
  },
  "sf10-records": {
    key: "sf10-records",
    tableName: "sf10_records",
    idColumn: "id",
    label: "SF10 record",
    orderBy: "updated_at DESC, id DESC",
    fields: [
      { requestKey: "studentId", columnName: "student_id", type: "number", required: true },
      { requestKey: "schoolId", columnName: "school_id", type: "number", nullable: true },
      { requestKey: "status", columnName: "status", type: "string", defaultValue: "draft" },
      { requestKey: "remarks", columnName: "remarks", type: "string", nullable: true },
      { requestKey: "createdBy", columnName: "created_by", type: "number", nullable: true },
      { requestKey: "verifiedBy", columnName: "verified_by", type: "number", nullable: true },
      { requestKey: "certifiedBy", columnName: "certified_by", type: "number", nullable: true },
      { requestKey: "completedAt", columnName: "completed_at", type: "datetime", nullable: true },
    ],
  },
  "scholastic-records": {
    key: "scholastic-records",
    tableName: "scholastic_records",
    idColumn: "id",
    label: "Scholastic record",
    orderBy: "grade_level ASC, id ASC",
    fields: [
      { requestKey: "sf10RecordId", columnName: "sf10_record_id", type: "number", required: true },
      { requestKey: "studentId", columnName: "student_id", type: "number", required: true },
      { requestKey: "schoolId", columnName: "school_id", type: "number", nullable: true },
      { requestKey: "schoolYearId", columnName: "school_year_id", type: "number", required: true },
      { requestKey: "sectionId", columnName: "section_id", type: "number", nullable: true },
      { requestKey: "adviserId", columnName: "adviser_id", type: "number", nullable: true },
      { requestKey: "gradeLevel", columnName: "grade_level", type: "number", required: true },
      { requestKey: "sectionName", columnName: "section_name", type: "string", nullable: true },
      { requestKey: "district", columnName: "district", type: "string", nullable: true },
      { requestKey: "division", columnName: "division", type: "string", nullable: true },
      { requestKey: "region", columnName: "region", type: "string", nullable: true },
      { requestKey: "generalAverage", columnName: "general_average", type: "number", nullable: true },
      { requestKey: "finalRemarks", columnName: "final_remarks", type: "string", nullable: true },
    ],
  },
  grades: {
    key: "grades",
    tableName: "student_grades",
    idColumn: "id",
    label: "Student grade",
    orderBy: "scholastic_record_id DESC, subject_id ASC, id ASC",
    fields: [
      { requestKey: "scholasticRecordId", columnName: "scholastic_record_id", type: "number", required: true },
      { requestKey: "subjectId", columnName: "subject_id", type: "number", required: true },
      { requestKey: "quarter1", columnName: "quarter_1", type: "number", nullable: true },
      { requestKey: "quarter2", columnName: "quarter_2", type: "number", nullable: true },
      { requestKey: "quarter3", columnName: "quarter_3", type: "number", nullable: true },
      { requestKey: "quarter4", columnName: "quarter_4", type: "number", nullable: true },
      { requestKey: "finalRating", columnName: "final_rating", type: "number", nullable: true },
      { requestKey: "remarks", columnName: "remarks", type: "string", nullable: true },
    ],
  },
  "remedial-classes": {
    key: "remedial-classes",
    tableName: "remedial_classes",
    idColumn: "id",
    label: "Remedial class",
    orderBy: "scholastic_record_id DESC, subject_id ASC, id ASC",
    fields: [
      { requestKey: "scholasticRecordId", columnName: "scholastic_record_id", type: "number", required: true },
      { requestKey: "subjectId", columnName: "subject_id", type: "number", required: true },
      { requestKey: "dateFrom", columnName: "date_from", type: "date", nullable: true },
      { requestKey: "dateTo", columnName: "date_to", type: "date", nullable: true },
      { requestKey: "finalRating", columnName: "final_rating", type: "number", nullable: true },
      { requestKey: "remedialClassMark", columnName: "remedial_class_mark", type: "number", nullable: true },
      { requestKey: "recomputedFinalGrade", columnName: "recomputed_final_grade", type: "number", nullable: true },
      { requestKey: "remarks", columnName: "remarks", type: "string", nullable: true },
    ],
  },
  "eligibility-records": {
    key: "eligibility-records",
    tableName: "eligibility_records",
    idColumn: "id",
    label: "Eligibility record",
    orderBy: "updated_at DESC, id DESC",
    fields: [
      { requestKey: "studentId", columnName: "student_id", type: "number", required: true },
      { requestKey: "sf10RecordId", columnName: "sf10_record_id", type: "number", nullable: true },
      { requestKey: "credentialType", columnName: "credential_type", type: "string", required: true },
      { requestKey: "schoolName", columnName: "school_name", type: "string", nullable: true },
      { requestKey: "schoolIdText", columnName: "school_id_text", type: "string", nullable: true },
      { requestKey: "schoolAddress", columnName: "school_address", type: "string", nullable: true },
      { requestKey: "peptRating", columnName: "pept_rating", type: "number", nullable: true },
      { requestKey: "examDate", columnName: "exam_date", type: "date", nullable: true },
      { requestKey: "testingCenter", columnName: "testing_center", type: "string", nullable: true },
      { requestKey: "otherCredential", columnName: "other_credential", type: "string", nullable: true },
      { requestKey: "remarks", columnName: "remarks", type: "string", nullable: true },
    ],
  },
  certifications: {
    key: "certifications",
    tableName: "sf10_certifications",
    idColumn: "id",
    label: "Certification",
    orderBy: "certification_date DESC, id DESC",
    fields: [
      { requestKey: "sf10RecordId", columnName: "sf10_record_id", type: "number", required: true },
      { requestKey: "studentId", columnName: "student_id", type: "number", required: true },
      { requestKey: "eligibleForGrade", columnName: "eligible_for_grade", type: "number", nullable: true },
      { requestKey: "schoolName", columnName: "school_name", type: "string", nullable: true },
      { requestKey: "schoolIdText", columnName: "school_id_text", type: "string", nullable: true },
      { requestKey: "division", columnName: "division", type: "string", nullable: true },
      { requestKey: "lastSchoolYearAttended", columnName: "last_school_year_attended", type: "string", nullable: true },
      { requestKey: "principalName", columnName: "principal_name", type: "string", nullable: true },
      { requestKey: "certificationDate", columnName: "certification_date", type: "date", nullable: true },
    ],
  },
} as const satisfies Record<string, AcademicEntityDefinition>;

export const academicEntityKeys = Object.keys(academicEntityDefinitions) as Array<keyof typeof academicEntityDefinitions>;
