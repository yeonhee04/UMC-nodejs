// 1. 클라이언트가 보내는 데이터 뼈대
export interface MissionCreateRequest {
  reward: number;
  deadline: string;
  missionSpec: string;
}

// 2. 요청 데이터를 시스템에 맞게 변환
export const bodyToMission = (body: any): MissionCreateRequest => {
  return {
    reward: body.reward,
    deadline: body.deadline,
    missionSpec: body.missionSpec,
  };
};

// 3. 응답 데이터 형태
export const responseFromMission = (insertId: number) => {
  return {
    missionId: insertId,
    message: "가게에 미션이 성공적으로 추가되었습니다!",
  };
};
