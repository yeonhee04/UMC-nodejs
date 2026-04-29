import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";

export const handleCreateStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const regionId = parseInt(req.params.regionId as string, 10);

    const storeData = bodyToStore(req.body);

    const result = await createStore(regionId, storeData);

    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: (error as Error).message });
  }
};
