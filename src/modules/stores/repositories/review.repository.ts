import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";
import { ReviewCreateRequest } from "../dtos/review.dto.js";

// 1. 가게가 실제로 존재하는지 조회하는 함수
export const getStoreById = async (storeId: number): Promise<any | null> => {
  const conn = await pool.getConnection();
  try {
    const [store] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM store WHERE id = ?;`,
      [storeId],
    );

    // 가게가 없으면 빈 배열이 반환되므로 null을 리턴
    if (store.length === 0) {
      return null;
    }
    return store[0];
  } catch (err) {
    throw new Error(`가게 조회 중 DB 오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

// 2. 리뷰를 DB에 추가하는 함수
export const addReview = async (
  storeId: number,
  data: ReviewCreateRequest,
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO review (store_id, user_id, score, body) VALUES (?, ?, ?, ?);`,
      [storeId, data.userId, data.score, data.body],
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`리뷰 추가 중 DB 오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
