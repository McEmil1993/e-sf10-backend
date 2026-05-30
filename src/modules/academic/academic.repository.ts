import type { ResultSetHeader } from "mysql2";

import { db } from "../../config/db";
import type { AcademicEntityDefinition, AcademicRow } from "./academic.interface";

const systemFields = ["created_at", "updated_at", "deleted_at"] as const;
type DbValue = string | number | boolean | Date | null;

const toResponseKey = (value: string) => value.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());

const normalizeValue = (value: unknown) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Buffer.isBuffer(value)) {
    return value.toString("utf8");
  }

  return value;
};

const mapRow = (row: AcademicRow, definition: AcademicEntityDefinition) => {
  const result: Record<string, unknown> = {
    id: normalizeValue(row[definition.idColumn]),
  };

  for (const field of definition.fields) {
    const rawValue = normalizeValue(row[field.columnName]);
    result[field.requestKey] = field.type === "boolean" ? Boolean(rawValue) : rawValue;
  }

  for (const field of definition.virtualFields ?? []) {
    const rawValue = normalizeValue(row[field.requestKey]);
    result[field.requestKey] = field.type === "boolean" ? Boolean(rawValue) : rawValue;
  }

  for (const fieldName of systemFields) {
    result[toResponseKey(fieldName)] = normalizeValue(row[fieldName]);
  }

  return result;
};

const getSelectColumns = (definition: AcademicEntityDefinition) => {
  const baseAlias = "base";
  const fieldColumns = definition.fields.map((field) => `${baseAlias}.\`${field.columnName}\``);
  const virtualColumns = (definition.virtualFields ?? []).map(
    (field) => `${field.selectSql} AS \`${field.requestKey}\``,
  );

  return [
    `${baseAlias}.\`${definition.idColumn}\``,
    ...fieldColumns,
    ...virtualColumns,
    ...systemFields.map((field) => `${baseAlias}.\`${field}\``),
  ].join(", ");
};

export const academicRepository = {
  async list(definition: AcademicEntityDefinition) {
    const [rows] = await db.query<AcademicRow[]>(
      `
        SELECT ${getSelectColumns(definition)}
        FROM \`${definition.tableName}\` base
        ${definition.joins ?? ""}
        WHERE base.deleted_at IS NULL
        ORDER BY ${definition.orderBy}
      `,
    );

    return rows.map((row) => mapRow(row, definition));
  },

  async findById(definition: AcademicEntityDefinition, id: number) {
    const [rows] = await db.query<AcademicRow[]>(
      `
        SELECT ${getSelectColumns(definition)}
        FROM \`${definition.tableName}\` base
        ${definition.joins ?? ""}
        WHERE base.\`${definition.idColumn}\` = ? AND base.deleted_at IS NULL
        LIMIT 1
      `,
      [id],
    );

    return rows[0] ? mapRow(rows[0], definition) : null;
  },

  async create(definition: AcademicEntityDefinition, payload: Record<string, unknown>) {
    const columns = definition.fields.map((field) => field.columnName);
    const placeholders = columns.map(() => "?").join(", ");
    const values = definition.fields.map((field) => payload[field.requestKey]) as DbValue[];
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO \`${definition.tableName}\` (${columns.map((column) => `\`${column}\``).join(", ")})
        VALUES (${placeholders})
      `,
      values,
    );

    const record = await this.findById(definition, result.insertId);

    if (!record) {
      throw new Error(`Failed to fetch created ${definition.label.toLowerCase()}.`);
    }

    return record;
  },

  async update(definition: AcademicEntityDefinition, id: number, payload: Record<string, unknown>) {
    const fields = definition.fields.filter((field) => field.requestKey in payload);
    const setSql = fields.map((field) => `\`${field.columnName}\` = ?`).join(", ");
    const values = fields.map((field) => payload[field.requestKey]) as DbValue[];

    await db.execute(
      `
        UPDATE \`${definition.tableName}\`
        SET ${setSql}
        WHERE \`${definition.idColumn}\` = ? AND deleted_at IS NULL
      `,
      [...values, id],
    );

    const record = await this.findById(definition, id);

    if (!record) {
      throw new Error(`Failed to fetch updated ${definition.label.toLowerCase()}.`);
    }

    return record;
  },

  async softDelete(definition: AcademicEntityDefinition, id: number) {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE \`${definition.tableName}\`
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE \`${definition.idColumn}\` = ? AND deleted_at IS NULL
      `,
      [id],
    );

    return result.affectedRows > 0;
  },
};
