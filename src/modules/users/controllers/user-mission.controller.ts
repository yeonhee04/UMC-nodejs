import {
  Body,
  Controller,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Route,
  Tags,
} from "tsoa";
import { ApiResponse, success } from "../../../common/responses/response.js";
import {
  challengeMission,
  changeMissionToComplete,
  listUserMissions,
} from "../services/user-mission.service.js";
import {
  UserMissionChallengeResponse,
  UserMissionListResponse,
  UserMissionUpdateResponse,
} from "../dtos/user-mission.dto.js";

@Route("users") // 기본 라우트: /users
@Tags("UserMissions") // Swagger 문서 그룹핑
export class UserMissionController extends Controller {
  // 1. 미션 도전하기 API
  @Post("missions/{missionId}") // 세부 경로: /users/missions/1
  public async handleChallengeMission(
    @Path() missionId: number,
    @Body() body: { userId: number },
  ): Promise<ApiResponse<UserMissionChallengeResponse>> {
    const result = await challengeMission(body.userId, missionId);
    return success(result);
  }

  // 2. 내가 진행 중인 미션 목록 조회 API
  @Get("{userId}/missions") // 세부 경로: /users/1/missions
  public async handleListUserMissions(
    @Path() userId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<UserMissionListResponse>> {
    const actualCursor = cursor || 0;
    const response = await listUserMissions(userId, actualCursor);
    return success(response);
  }

  // 3. 진행 중인 미션을 완료 상태로 변경 API
  @Patch("{userId}/missions/{missionId}") // 세부 경로: /users/1/missions/2
  public async handleCompleteUserMission(
    @Path() userId: number,
    @Path() missionId: number,
  ): Promise<ApiResponse<UserMissionUpdateResponse>> {
    const response = await changeMissionToComplete(userId, missionId);
    return success(response);
  }
}
