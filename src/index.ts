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

import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";

passport.use(googleStrategy);
passport.use(jwtStrategy);

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
app.use(passport.initialize());

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

// [A] 구글 로그인 시작 주소 (접속 시 구글 로그인 창으로 리다이렉트)
app.get("/oauth2/login/google", passport.authenticate("google", { session: false }));

// [B] 구글 로그인 성공 후 콜백 주소 (유저 확인 후 서버의 JWT 반환)
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  (req, res) => {
    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
        message: "구글 로그인에 성공하여 우리 서버의 토큰을 발급했습니다!",
        tokens: req.user, // auth.config.ts의 cb(null, tokens)에서 넘어온 값
      },
    });
  }
);

// [C] JWT 검증용 테스트 마이페이지 (인가/인증 테스트용 주소)
const isLogin = passport.authenticate("jwt", { session: false });

app.get("/mypage", isLogin, (req: any, res) => {
  res.status(200).json({
    resultType: "SUCCESS",
    error: null,
    success: {
      message: `인증 성공! ${req.user.name} 님의 마이페이지입니다.`,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
      },
    },
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
