import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser, UserSignUpRequest } from "../dtos/user.dto.js";
import { listUserReviews, userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body);

  try {
    const user = await userSignUp(bodyToUser(req.body as UserSignUpRequest));
    res.status(StatusCodes.OK).json({ result: user });
  } catch (error) {
    // 이미 가입된 이메일 등 에러가 발생했을 때 처리
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: (error as Error).message });
  }
};

export const handleListUserReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parseInt(req.params.userId as string, 10);
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;

    const response = await listUserReviews(userId, cursor);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
