import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {
  challengeMission,
  changeMissionToComplete,
  listUserMissions,
} from "../services/user-mission.service.js";

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

export const handleListUserMissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parseInt(req.params.userId as string, 10);
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;

    const response = await listUserMissions(userId, cursor);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const handleCompleteUserMission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parseInt(req.params.userId as string, 10);
    const missionId = parseInt(req.params.missionId as string, 10);

    const response = await changeMissionToComplete(userId, missionId);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
