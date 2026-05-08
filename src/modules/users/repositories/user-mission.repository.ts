import { prisma } from "../../../db.config.js";

// 1. 미션 자체가 존재하는지 확인
export const getMissionById = async (missionId: number) => {
  const mission = await prisma.mission.findFirst({
    where: { id: missionId },
  });

  return mission;
};

// 2. 유저가 해당 미션에 이미 도전 중인지 확인
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

// 3. 유저가 미션에 도전하는 기록 추가
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

// 4. 유저가 진행 중인 미션 목록을 페이징 처리하여 조회
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
              name: true,
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

// 5. 유저가 진행 중인 미션을 '진행완료'로 상태 변경
export const updateMissionToComplete = async (
  userId: number,
  missionId: number,
) => {
  // (1) 유저가 현재 '진행중'인 해당 미션이 있는지 찾기
  const userMission = await prisma.userMission.findFirst({
    where: {
      userId: userId,
      missionId: missionId,
      status: "진행중",
    },
  });

  // (2) 없다면 null 반환
  if (!userMission) {
    return null;
  }

  // (3) 찾았다면 상태를 '진행완료'로 업데이트하고 결과 반환
  return await prisma.userMission.update({
    where: { id: userMission.id },
    data: { status: "진행완료" },
  });
};
