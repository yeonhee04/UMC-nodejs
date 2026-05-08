import { prisma } from "../../../db.config.js";
import {
  UserMissionChallengeResponse,
  UserMissionListResponse,
  UserMissionUpdateResponse,
} from "../dtos/user-mission.dto.js";
import {
  getMissionById,
  getUserMission,
  addUserMission,
  getUserMissions,
  updateMissionToComplete,
} from "../repositories/user-mission.repository.js";

import {
  MissionNotFoundError,
  MissionAlreadyChallengedError,
  MissionNotChallengingError,
} from "../../../common/errors/error.js";

// 1. 유저가 미션에 도전하는 서비스
export const challengeMission = async (
  userId: number,
  missionId: number,
): Promise<UserMissionChallengeResponse> => {
  // (1) 미션 존재 여부 검증
  const mission = await getMissionById(missionId);
  if (!mission) {
    throw new MissionNotFoundError("요청하신 미션이 존재하지 않습니다.", {
      missionId,
    });
  }

  // (2) 이미 도전 중인 미션인지 검증
  const existingMission = await getUserMission(userId, missionId);
  if (existingMission) {
    throw new MissionAlreadyChallengedError("이미 도전 중인 미션입니다.", {
      userId,
      missionId,
    });
  }

  // (3) 검증 통과 시 미션 도전 추가
  const insertId = await addUserMission(userId, missionId);

  return <UserMissionChallengeResponse>{
    userMissionId: insertId,
    message: "미션 도전을 시작했습니다!",
  };
};

// 2. 유저가 진행 중인 미션 목록을 조회하는 서비스
export const listUserMissions = async (
  userId: number,
  cursor: number,
): Promise<UserMissionListResponse> => {
  const userMissions = (await getUserMissions(userId, cursor)) || [];

  return <UserMissionListResponse>{
    data: userMissions,
    pagination: {
      cursor:
        userMissions.length > 0
          ? userMissions[userMissions.length - 1]!.id
          : null,
    },
  };
};

// 3. 유저가 진행 중인 미션을 '진행완료'로 상태 변경하는 서비스
export const changeMissionToComplete = async (
  userId: number,
  missionId: number,
): Promise<UserMissionUpdateResponse> => {
  const updatedMission = await updateMissionToComplete(userId, missionId);

  if (!updatedMission) {
    throw new MissionNotChallengingError(
      "해당 미션을 진행 중이지 않거나, 이미 완료된 미션입니다.",
      { userId, missionId },
    );
  }

  return <UserMissionUpdateResponse>{
    userMissionId: updatedMission.id,
    userId: updatedMission.userId,
    missionId: updatedMission.missionId,
    status: updatedMission.status,
  };
};
