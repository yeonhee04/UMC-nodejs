import { prisma } from "../../../db.config.js";

// 1. 미션 자체가 존재하는지 확인
export const getMissionById = async (missionId: number) => {
  const mission = await prisma.mission.findFirst({
    where: { id: missionId },
  });

  return mission;
};

// 2. 유저가 이미 해당 미션을 '진행중'인지 확인
export const getUserMission = async (userId: number, missionId: number) => {
  const userMission = await prisma.userMission.findFirst({
    where: {
      userId: userId,
      missionId: missionId,
      status: "진행중",
    },
  });

  return userMission;
};

// 3. 미션 도전 기록을 DB에 추가
export const addUserMission = async (userId: number, missionId: number) => {
  const created = await prisma.userMission.create({
    data: {
      userId: userId,
      missionId: missionId,
      status: "진행중",
    },
  });

  return created.id;
};

// 유저가 진행 중인 미션 목록을 가져오는 함수
export const getUserMissions = async (userId: number, cursor: number) => {
  const userMissions = await prisma.userMission.findMany({
    select: {
      id: true,
      status: true,
      mission: {
        select: {
          id: true,
          reward: true,
          deadline: true,
          missionSpec: true,
          store: {
            select: {
              name: true, // 미션을 수행할 가게 이름
            },
          },
        },
      },
    },
    where: {
      userId: userId,
      status: "진행중", // 상태가 '진행중'인 것만 골라오기
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return userMissions;
};
