import {
  MissionCreateRequest,
  responseFromMission,
} from "../dtos/mission.dto.js";
import { addMission } from "../repositories/mission.repository.js";
import { getStoreById } from "../repositories/review.repository.js";

export const createMission = async (
  storeId: number,
  data: MissionCreateRequest,
) => {
  // 1. 가게가 존재하는지 검증
  const store = await getStoreById(storeId);

  if (!store) {
    throw new Error("요청하신 가게가 존재하지 않습니다.");
  }

  // 2. 검증 통과 시 미션 추가
  const insertId = await addMission(storeId, data);

  // 3. 성공 응답 포장
  return responseFromMission(insertId);
};
