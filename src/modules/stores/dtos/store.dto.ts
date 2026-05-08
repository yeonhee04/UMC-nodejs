// 1. 가게 추가 요청 DTO
export interface StoreCreateRequest {
  name: string;
  address: string;
  categoryId: number;
}

// 2. 가게 추가 성공 응답 DTO
export interface StoreResponse {
  storeId: number;
  message: string;
}
