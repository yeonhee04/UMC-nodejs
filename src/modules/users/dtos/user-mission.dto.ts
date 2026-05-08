// 1. 미션 도전 시작 응답 DTO
export interface UserMissionChallengeResponse {
  userMissionId: number;
  message: string;
}

// 2. 내가 진행 중인 미션 목록 조회 응답 DTO
export interface UserMissionListResponse {
  data: any[];
  pagination: {
    cursor: number | null;
  };
}

// 3. 미션 상태 변경(완료 등) 응답 DTO
export interface UserMissionUpdateResponse {
  userMissionId: number;
  userId: number;
  missionId: number;
  status: string;
}
