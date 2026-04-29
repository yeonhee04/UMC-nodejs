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
