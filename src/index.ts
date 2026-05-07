import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { handleUserSignUp } from "./modules/users/controllers/user.controller.js";
import { handleCreateStore } from "./modules/stores/controllers/store.controller.js";
import { handleCreateReview } from "./modules/stores/controllers/review.controller.js";
import { handleCreateMission } from "./modules/stores/controllers/mission.controller.js";
import {
  handleChallengeMission,
  handleCompleteUserMission,
  handleListUserMissions,
} from "./modules/users/controllers/user-mission.controller.js";
import { handleListStoreReviews } from "./modules/stores/controllers/review.controller.js";
import { handleListUserReviews } from "./modules/users/controllers/user.controller.js";
import { handleListStoreMissions } from "./modules/stores/controllers/mission.controller.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/regions/:regionId/stores", handleCreateStore);
app.post("/api/v1/stores/:storeId/reviews", handleCreateReview);
app.post("/api/v1/stores/:storeId/missions", handleCreateMission);
app.post("/api/v1/users/missions/:missionId", handleChallengeMission);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews); // 가게 리뷰 목록 조회 API
app.get("/api/v1/users/:userId/reviews", handleListUserReviews); // 내가 작성한 리뷰 목록 조회 API
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions); // 특정 가게의 미션 목록 조회 API
app.get("/api/v1/users/:userId/missions", handleListUserMissions); // 내가 진행 중인 미션 목록 조회 API
app.patch(
  "/api/v1/users/:userId/missions/:missionId",
  handleCompleteUserMission,
); // 진행 중인 미션을 진행 완료로 바꾸기 API

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
