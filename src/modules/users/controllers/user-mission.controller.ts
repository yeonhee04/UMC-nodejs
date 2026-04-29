import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/user-mission.service.js";

export const handleChallengeMission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const missionId = parseInt(req.params.missionId as string, 10);
    // JWT 토큰 로그인이 없으므로 임시로 body에서 유저 ID를 받음
    const userId = req.body.userId;

    const result = await challengeMission(userId, missionId);
    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: (error as Error).message });
  }
};
