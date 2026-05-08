import {
  ReviewCreateRequest,
  ReviewResponse,
  ReviewListResponse,
} from "../dtos/review.dto.js";
import {
  addReview,
  getAllStoreReviews,
} from "../repositories/review.repository.js";
import { getStoreById } from "../repositories/store.repository.js";

import { StoreNotFoundError } from "../../../common/errors/error.js";

export const createReview = async (
  storeId: number,
  data: ReviewCreateRequest,
): Promise<ReviewResponse> => {
  // 1. 리뷰를 남길 가게가 존재하는지 검증
  const store = await getStoreById(storeId);

  if (!store) {
    throw new StoreNotFoundError("요청하신 가게가 존재하지 않습니다.", {
      storeId,
    });
  }

  // 2. 검증을 통과했다면 정상적으로 리뷰를 DB에 추가
  const insertId = await addReview(storeId, data);

  return <ReviewResponse>{
    reviewId: insertId,
    message: "리뷰가 성공적으로 작성되었습니다!",
  };
};

export const listStoreReviews = async (
  storeId: number,
  cursor: number,
): Promise<ReviewListResponse> => {
  const reviews = (await getAllStoreReviews(storeId, cursor)) || [];

  return <ReviewListResponse>{
    data: reviews,
    pagination: {
      cursor: reviews.length > 0 ? reviews[reviews.length - 1]!.id : null,
    },
  };
};
