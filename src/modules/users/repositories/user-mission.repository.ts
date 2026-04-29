import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";

// 1. 미션 자체가 존재하는지 확인
export const getMissionById = async (
  missionId: number,
): Promise<any | null> => {
  const conn = await pool.getConnection();
  try {
    const [mission] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM mission WHERE id = ?;`,
      [missionId],
    );
    return mission.length === 0 ? null : mission[0];
  } finally {
    conn.release();
  }
};

// 2. 유저가 이미 해당 미션을 '진행중'인지 확인
export const getUserMission = async (
  userId: number,
  missionId: number,
): Promise<any | null> => {
  const conn = await pool.getConnection();
  try {
    const [userMission] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM user_mission WHERE user_id = ? AND mission_id = ? AND status = '진행중';`,
      [userId, missionId],
    );
    return userMission.length === 0 ? null : userMission[0];
  } finally {
    conn.release();
  }
};

// 3. 미션 도전 기록을 DB에 추가
export const addUserMission = async (
  userId: number,
  missionId: number,
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO user_mission (user_id, mission_id, status) VALUES (?, ?, '진행중');`,
      [userId, missionId],
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};
