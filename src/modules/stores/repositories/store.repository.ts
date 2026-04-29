import { ResultSetHeader } from "mysql2";
import { pool } from "../../../db.config.js";
import { StoreCreateRequest } from "../dtos/store.dto.js";

export const addStore = async (
  regionId: number,
  data: StoreCreateRequest,
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO store (region_id, food_category_id, name, address) VALUES (?, ?, ?, ?);`,
      [regionId, data.categoryId, data.name, data.address],
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`가게 추가 중 DB 오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
