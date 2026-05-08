import { prisma } from "../../../db.config.js";
import { ReviewCreateRequest } from "../dtos/review.dto.js";

// 1. 리뷰를 DB에 추가하는 함수
export const addReview = async (storeId: number, data: ReviewCreateRequest) => {
  const created = await prisma.userStoreReview.create({
    data: {
      storeId: storeId,
      userId: data.userId,
      content: data.body,
      score: data.score,
    },
  });

  return created.id;
};

// 2. 특정 가게의 리뷰 목록 조회
export const getAllStoreReviews = async (storeId: number, cursor: number) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: {
      id: true,
      content: true,
      store: true,
      user: true,
    },
    where: {
      storeId: storeId,
      id: {
        gt: cursor,
      },
    },
    orderBy: {
      id: "asc",
    },
    take: 5,
  });

  return reviews;
};
