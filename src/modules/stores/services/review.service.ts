import { ReviewCreateRequest, responseFromReview } from "../dtos/review.dto.js";
import { getStoreById, addReview } from "../repositories/review.repository.js";

export const createReview = async (
  storeId: number,
  data: ReviewCreateRequest,
) => {
  // 1. 리뷰를 남길 가게가 존재하는지 검증
  const store = await getStoreById(storeId);

  if (!store) {
    // 가게가 없으면 여기서 로직을 멈추고 에러 처리
    throw new Error("요청하신 가게가 존재하지 않습니다.");
  }

  // 2. 검증을 통과했다면 정상적으로 리뷰를 DB에 추가
  const insertId = await addReview(storeId, data);

  // 3. 성공 응답 생성
  return responseFromReview(insertId);
};
