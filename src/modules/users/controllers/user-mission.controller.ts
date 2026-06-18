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
  SuccessResponse,
  Response,
  Middlewares,
  Request,
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
import passport from "passport";

const isLogin = passport.authenticate("jwt", { session: false });

@Route("users") // 기본 라우트: /users
@Tags("UserMissions") // Swagger 문서 그룹핑
export class UserMissionController extends Controller {
  /**
   * @summary 미션 도전하기 API
   */
  @SuccessResponse("200", "미션 도전 성공")
  @Response("404", "요청하신 미션이 존재하지 않습니다. (에러코드: M001)")
  @Response("409", "이미 도전 중인 미션입니다. (에러코드: M002)")
  @Post("missions/{missionId}") // 세부 경로: /users/missions/1
  @Middlewares(isLogin)
  public async handleChallengeMission(
    @Path() missionId: number,
    @Request() req: any,
  ): Promise<ApiResponse<UserMissionChallengeResponse>> {
    const userId = req.user.id;
    const result = await challengeMission(userId, missionId);
    return success(result);
  }

  /**
   * @summary 진행 중인 미션 목록 조회 API
   */
  @SuccessResponse("200", "진행 중인 미션 목록 조회 성공")
  @Get("me/missions") // 세부 경로: /users/1/missions
  @Middlewares(isLogin)
  public async handleListUserMissions(
    @Request() req: any,
    @Query() cursor?: number,
  ): Promise<ApiResponse<UserMissionListResponse>> {
    const actualCursor = cursor || 0;

    const userId = req.user.id;

    const response = await listUserMissions(userId, actualCursor);
    return success(response);
  }

  /**
   * @summary 미션 완료 처리 API
   */
  @SuccessResponse("200", "미션 완료 상태로 변경 성공")
  @Response("400", "해당 미션을 진행 중이지 않거나, 이미 완료된 미션입니다. (에러코드: M003)")
  @Patch("me/missions/{missionId}") // 세부 경로: /users/1/missions/2
  @Middlewares(isLogin)
  public async handleCompleteUserMission(
    @Path() missionId: number,
    @Request() req: any,
  ): Promise<ApiResponse<UserMissionUpdateResponse>> {
    const userId = req.user.id;
    const response = await changeMissionToComplete(userId, missionId);
    return success(response);
  }
}
