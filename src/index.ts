import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import { RegisterRoutes } from "./generated/routes.js";
import { AppError } from "./common/errors/app.error.js";

import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

const swaggerFilePath = path.resolve("dist/swagger.json");
if (fs.existsSync(swaggerFilePath)) {
  const swaggerFile = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));
  
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
} else {
  console.log("swagger.json 파일이 아직 생성되지 않았습니다.");
}

const router = express.Router();
RegisterRoutes(router);

app.use("/api/v1", router);
// 전역 에러 처리 미들웨어
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const errorCode = err instanceof AppError ? err.errorCode : "UNKNOWN";

  res.status(statusCode).json({
    resultType: "FAILED",
    error: {
      errorCode: errorCode,
      reason: err.message || "알 수 없는 오류가 발생했습니다.",
      data: err.data || null,
    },
    success: null,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
