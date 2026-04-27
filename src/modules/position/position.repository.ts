import type { ResultSetHeader } from "mysql2";

import { db } from "../../config/db";
import type {
  CreatePositionInput,
  PositionRecord,
  PositionRow,
  UpdatePositionInput,
} from "./position.interface";

const basePositionSelect = `
  SELECT
    id,
    acronym,
    full_position AS fullPosition,
    category,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM positions
`;

const mapPosition = (row: PositionRow): PositionRecord => {
  return {
    id: row.id,
    acronym: row.acronym,
    fullPosition: row.fullPosition,
    category: row.category,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
};

const findOne = async (query: string, values: unknown[]): Promise<PositionRecord | null> => {
  const [rows] = await db.query<PositionRow[]>(query, values);
  const position = rows[0];

  return position ? mapPosition(position) : null;
};

export const positionRepository = {
  async findAll(): Promise<PositionRecord[]> {
    const [rows] = await db.query<PositionRow[]>(
      `${basePositionSelect} WHERE deleted_at IS NULL ORDER BY id DESC`,
    );

    return rows.map(mapPosition);
  },

  async findById(positionId: number): Promise<PositionRecord | null> {
    return findOne(`${basePositionSelect} WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [positionId]);
  },

  async createPosition(payload: CreatePositionInput): Promise<PositionRecord> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO positions (
          acronym,
          full_position,
          category
        )
        VALUES (?, ?, ?)
      `,
      [payload.acronym, payload.fullPosition, payload.category],
    );

    const createdPosition = await this.findById(result.insertId);

    if (!createdPosition) {
      throw new Error("Failed to fetch created position.");
    }

    return createdPosition;
  },

  async updatePosition(positionId: number, payload: UpdatePositionInput): Promise<PositionRecord> {
    await db.execute(
      `
        UPDATE positions
        SET
          acronym = ?,
          full_position = ?,
          category = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [payload.acronym, payload.fullPosition, payload.category, positionId],
    );

    const updatedPosition = await this.findById(positionId);

    if (!updatedPosition) {
      throw new Error("Failed to fetch updated position.");
    }

    return updatedPosition;
  },

  async softDeletePosition(positionId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE positions
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
      `,
      [positionId],
    );

    return result.affectedRows > 0;
  },
};
