// 성공 시 클라이언트에게 보낼 응답 형태
export const responseFromUserMission = (insertId: number) => {
  return {
    userMissionId: insertId,
    message: "미션 도전을 시작했습니다!",
  };
};

export const responseFromUserMissions = (userMissions: any[]) => {
  return {
    data: userMissions,
    pagination: {
      cursor:
        userMissions.length > 0
          ? userMissions[userMissions.length - 1].id
          : null,
    },
  };
};

// 상태 변경 완료 응답 DTO
export const responseFromUpdateUserMission = (updatedMission: any) => {
  return {
    userMissionId: updatedMission.id,
    userId: updatedMission.userId,
    missionId: updatedMission.missionId,
    status: updatedMission.status,
  };
};
