import { prisma } from "../../../db.config.js";
import { MissionCreateRequest } from "../dtos/mission.dto.js";

// 1. 미션을 DB에 추가하는 함수
export const addMission = async (
  storeId: number,
  data: MissionCreateRequest,
) => {
  const created = await prisma.mission.create({
    data: {
      storeId: storeId,
      reward: data.reward,
      deadline: new Date(data.deadline),
      missionSpec: data.missionSpec,
    },
  });

  return created.id;
};

// 2. 특정 가게의 미션 목록을 5개씩 가져오는 함수
export const getStoreMissions = async (storeId: number, cursor: number) => {
  const missions = await prisma.mission.findMany({
    select: {
      id: true,
      reward: true,
      deadline: true,
      missionSpec: true,
      store: {
        select: {
          name: true,
        },
      },
    },
    where: {
      storeId: storeId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return missions;
};
