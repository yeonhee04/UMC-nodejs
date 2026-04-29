import { ResultSetHeader } from "mysql2";
import { pool } from "../../../db.config.js";
import { MissionCreateRequest } from "../dtos/mission.dto.js";

// 미션을 DB에 추가하는 함수
export const addMission = async (
  storeId: number,
  data: MissionCreateRequest,
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO mission (store_id, reward, deadline, mission_spec) VALUES (?, ?, ?, ?);`,
      [storeId, data.reward, data.deadline, data.missionSpec],
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`미션 추가 중 DB 오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
