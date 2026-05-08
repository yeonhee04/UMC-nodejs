// 1. 미션 생성 요청 DTO
export interface MissionCreateRequest {
  reward: number;
  deadline: string;
  missionSpec: string;
}

// 2. 미션 생성 응답 DTO
export interface MissionResponse {
  missionId: number;
  message: string;
}

// 3. 가게별 미션 목록 조회 응답 DTO
export interface MissionListResponse {
  data: any[];
  pagination: {
    cursor: number | null;
  };
}
