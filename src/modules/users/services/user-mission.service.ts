import { responseFromUserMission } from "../dtos/user-mission.dto.js";
import {
  getMissionById,
  getUserMission,
  addUserMission,
} from "../repositories/user-mission.repository.js";

export const challengeMission = async (userId: number, missionId: number) => {
  // 1. 미션 존재 여부 검증
  const mission = await getMissionById(missionId);
  if (!mission) {
    throw new Error("요청하신 미션이 존재하지 않습니다.");
  }

  // 2. 이미 도전 중인 미션인지 검증
  const existingMission = await getUserMission(userId, missionId);
  if (existingMission) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  // 3. 검증 통과 시 미션 도전 추가
  const insertId = await addUserMission(userId, missionId);

  return responseFromUserMission(insertId);
};
