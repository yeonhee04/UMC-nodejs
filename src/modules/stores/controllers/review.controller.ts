import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview, listStoreReviews } from "../services/review.service.js";

export const handleCreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. 주소창에서 storeId 추출 및 숫자로 변환
    const storeId = parseInt(req.params.storeId as string, 10);

    // 2. 클라이언트의 Body 데이터 변환
    const reviewData = bodyToReview(req.body);

    // 3. 서비스 로직 호출
    const result = await createReview(storeId, reviewData);

    // 4. 성공 응답
    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: (error as Error).message });
  }
};

export const handleListStoreReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. 주소에서 가게 ID 뽑기
    const storeId = parseInt(req.params.storeId as string, 10);

    // 2. 주소 뒤의 ?cursor= 값 뽑기 (값이 없으면 0으로 시작)
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;

    // 3. 서비스 호출 및 응답
    const reviews = await listStoreReviews(storeId, cursor);
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};
