import { Body, Controller, Get, Path, Post, Query, Route, Tags, SuccessResponse, Response } from "tsoa";
import { ApiResponse, success } from "../../../common/responses/response.js";
import {
  createMission,
  listStoreMissions,
} from "../services/mission.service.js";

import {
  MissionCreateRequest,
  MissionResponse,
  MissionListResponse,
} from "../dtos/mission.dto.js";

@Route("stores") // 기본 API 경로 (/stores)
@Tags("Missions") // Swagger 문서 그룹핑
export class MissionController extends Controller {

  /**
   * 특정 가게(Store)에 새로운 미션(Mission)을 추가합니다.
   * 성공 시 생성된 미션의 고유 ID와 성공 메시지를 반환합니다.
   * @summary 특정 가게에 미션 추가 API
   */
  @SuccessResponse("200", "미션 추가 성공")
  @Response("400", "잘못된 요청 데이터 (필수값 누락, 날짜 형식 오류 등)")
  @Response("404", "요청하신 가게가 존재하지 않습니다.")
  @Post("{storeId}/missions") // 세부 경로 (/stores/1/missions)
  public async handleCreateMission(
    @Path() storeId: number,
    @Body() body: MissionCreateRequest,
  ): Promise<ApiResponse<MissionResponse>> {
    const result = await createMission(storeId, body);

    return success(result);
  }

  /**
   * 특정 가게(Store)에 등록된 미션 목록을 페이징 처리하여 조회합니다.
   * @summary 가게 미션 목록 조회 API
   */
  @SuccessResponse("200", "가게 미션 목록 조회 성공")
  @Get("{storeId}/missions")
  public async handleListStoreMissions(
    @Path() storeId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<MissionListResponse>> {
    const actualCursor = cursor || 0;
    const response = await listStoreMissions(storeId, actualCursor);

    return success(response);
  }
}
