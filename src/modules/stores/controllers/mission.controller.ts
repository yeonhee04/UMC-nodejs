import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission } from "../services/mission.service.js";

export const handleCreateMission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. 주소창에서 storeId 추출
    const storeId = parseInt(req.params.storeId as string, 10);

    // 2. Body 데이터 다듬기
    const missionData = bodyToMission(req.body);

    // 3. 서비스 로직 호출
    const result = await createMission(storeId, missionData);

    // 4. 성공 응답
    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: (error as Error).message });
  }
};
