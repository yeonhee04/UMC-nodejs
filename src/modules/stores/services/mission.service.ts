import {
  MissionCreateRequest,
  MissionResponse,
  MissionListResponse,
} from "../dtos/mission.dto.js";

import {
  addMission,
  getStoreMissions,
} from "../repositories/mission.repository.js";
import { getStoreById } from "../repositories/store.repository.js";

import { StoreNotFoundError } from "../../../common/errors/error.js";

// 1. 특정 가게에 미션 추가
export const createMission = async (
  storeId: number,
  data: MissionCreateRequest,
): Promise<MissionResponse> => {
  const store = await getStoreById(storeId);
  if (!store) {
    throw new StoreNotFoundError("해당 가게가 존재하지 않습니다.", { storeId });
  }

  const insertId = await addMission(storeId, data);

  return <MissionResponse>{
    missionId: insertId,
    message: "가게에 미션이 성공적으로 추가되었습니다!",
  };
};

// 2. 가게 미션 목록 조회 서비스
export const listStoreMissions = async (
  storeId: number,
  cursor: number,
): Promise<MissionListResponse> => {
  const missions = (await getStoreMissions(storeId, cursor)) || [];

  return <MissionListResponse>{
    data: missions,
    pagination: {
      cursor: missions.length > 0 ? missions[missions.length - 1]!.id : null,
    },
  };
};
