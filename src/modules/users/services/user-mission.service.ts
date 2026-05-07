import { prisma } from "../../../db.config.js";
import {
  responseFromUpdateUserMission,
  responseFromUserMission,
  responseFromUserMissions,
} from "../dtos/user-mission.dto.js";
import {
  getMissionById,
  getUserMission,
  addUserMission,
  getUserMissions,
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

export const listUserMissions = async (userId: number, cursor: number) => {
  const userMissions = await getUserMissions(userId, cursor);
  return responseFromUserMissions(userMissions);
};

// 특정 유저가 진행 중인 미션을 '진행완료' 상태로 변경하는 함수
export const completeUserMission = async (
  userId: number,
  missionId: number,
) => {
  // 1. 유저가 현재 '진행중'인 해당 미션이 있는지 먼저 찾음
  const userMission = await prisma.userMission.findFirst({
    where: {
      userId: userId,
      missionId: missionId,
      status: "진행중",
    },
  });

  // 2. 만약 없다면 null을 반환해서 Service에서 에러를 처리
  if (!userMission) {
    return null;
  }

  // 3. 찾았다면, 해당 데이터의 고유 id를 이용해 상태를 업데이트
  const updatedMission = await prisma.userMission.update({
    where: { id: userMission.id },
    data: { status: "진행완료" },
  });

  return updatedMission;
};

// 미션 상태를 '진행완료'로 바꾸는 비즈니스 로직
export const changeMissionToComplete = async (
  userId: number,
  missionId: number,
) => {
  const updatedMission = await completeUserMission(userId, missionId);

  if (!updatedMission) {
    throw new Error("해당 미션을 진행 중이지 않거나, 이미 완료된 미션입니다.");
  }

  return responseFromUpdateUserMission(updatedMission);
};
