// 1. 리뷰 작성 요청 DTO
export interface ReviewCreateRequest {
  userId: number;
  score: number;
  body: string;
}

// 2. 리뷰 작성 성공 응답 DTO
export interface ReviewResponse {
  reviewId: number;
  message: string;
}

// 3. 리뷰 목록 조회 응답 DTO
export interface ReviewListResponse {
  data: any[];
  pagination: {
    cursor: number | null;
  };
}
