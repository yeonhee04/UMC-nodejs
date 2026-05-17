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
  /**
   * 특정 미션에 도전을 시작합니다.
   * 성공 시 생성된 유저-미션의 고유 ID와 성공 메시지를 반환합니다.
   * @summary 미션 도전하기 API
   */
  @SuccessResponse("200", "미션 도전 성공")
  @Response("404", "요청하신 미션이 존재하지 않습니다. (에러코드: M001)")
  @Response("409", "이미 도전 중인 미션입니다. (에러코드: M002)")
  @Post("missions/{missionId}") // 세부 경로: /users/missions/1
  public async handleChallengeMission(
    @Path() missionId: number,
    @Body() body: { userId: number },
  ): Promise<ApiResponse<UserMissionChallengeResponse>> {
    const result = await challengeMission(body.userId, missionId);
    return success(result);
  }

  /**
   * 특정 유저가 현재 진행 중인 미션 목록을 페이징 처리하여 조회합니다.
   * @summary 진행 중인 미션 목록 조회 API
   */
  @SuccessResponse("200", "진행 중인 미션 목록 조회 성공")
  @Get("{userId}/missions") // 세부 경로: /users/1/missions
  public async handleListUserMissions(
    @Path() userId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<UserMissionListResponse>> {
    const actualCursor = cursor || 0;
    const response = await listUserMissions(userId, actualCursor);
    return success(response);
  }

  /**
   * 유저가 진행 중인 특정 미션을 '진행완료' 상태로 업데이트합니다.
   * @summary 미션 완료 처리 API
   */
  @SuccessResponse("200", "미션 완료 상태로 변경 성공")
  @Response("400", "해당 미션을 진행 중이지 않거나, 이미 완료된 미션입니다. (에러코드: M003)")
  @Patch("{userId}/missions/{missionId}") // 세부 경로: /users/1/missions/2
  public async handleCompleteUserMission(
    @Path() userId: number,
    @Path() missionId: number,
  ): Promise<ApiResponse<UserMissionUpdateResponse>> {
    const response = await changeMissionToComplete(userId, missionId);
    return success(response);
  }
}
