// 성공 시 클라이언트에게 보낼 응답 형태
export const responseFromUserMission = (insertId: number) => {
  return {
    userMissionId: insertId,
    message: "미션 도전을 시작했습니다!",
  };
};
