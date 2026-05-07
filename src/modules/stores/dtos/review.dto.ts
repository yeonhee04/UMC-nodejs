export interface ReviewCreateRequest {
  userId: number;
  score: number;
  body: string;
}

export const bodyToReview = (body: any): ReviewCreateRequest => {
  return {
    userId: body.userId,
    score: body.score,
    body: body.body,
  };
};

export const responseFromReview = (insertId: number) => {
  return {
    reviewId: insertId,
    message: "리뷰가 성공적으로 작성되었습니다!",
  };
};

export const responseFromReviews = (reviews: any[]) => {
  // 불러온 리뷰 중 가장 마지막 리뷰를 찾음.
  const lastReview = reviews[reviews.length - 1];

  return {
    data: reviews,
    pagination: {
      // 마지막 리뷰가 있으면 그 ID를 책갈피(cursor)로 주고, 없으면 null을 줌.
      cursor: lastReview ? lastReview.id : null,
    },
  };
};
