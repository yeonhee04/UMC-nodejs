// 1. 회원가입 요청 DTO
export interface UserSignUpRequest {
  email: string;
  password: string; // 비밀번호 추가
  name: string;
  gender: string;
  birth: string;
  address?: string;
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
}

// 2. 회원가입 응답 DTO
export interface UserSignUpResponse {
  email: string;
  name: string;
  preferCategory: string[];
}

// 3. 내 리뷰 목록 응답 DTO
export interface UserReviewsResponse {
  data: any[];
  pagination: {
    cursor: number | null;
  };
}

// 4. 회원 정보 수정 요청 DTO
export interface UserUpdateRequest {
  name?: string;
  gender?: string;
  birth?: string;
  address?: string;
  detailAddress?: string;
  phoneNumber?: string;
}