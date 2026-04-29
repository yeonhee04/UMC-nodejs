import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { handleUserSignUp } from "./modules/users/controllers/user.controller.js";
import { handleCreateStore } from "./modules/stores/controllers/store.controller.js";
import { handleCreateReview } from "./modules/stores/controllers/review.controller.js";
import { handleCreateMission } from "./modules/stores/controllers/mission.controller.js";
import { handleChallengeMission } from "./modules/users/controllers/user-mission.controller.js";

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
