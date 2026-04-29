import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser, UserSignUpRequest } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

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
