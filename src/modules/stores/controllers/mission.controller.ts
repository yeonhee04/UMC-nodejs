import { Body, Controller, Get, Path, Post, Query, Route, Tags } from "tsoa";
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
  // 1. 특정 가게에 미션 추가 API
  @Post("{storeId}/missions") // 세부 경로 (/stores/1/missions)
  public async handleCreateMission(
    @Path() storeId: number,
    @Body() body: MissionCreateRequest,
  ): Promise<ApiResponse<MissionResponse>> {
    const result = await createMission(storeId, body);

    return success(result);
  }

  // 2. 특정 가게의 미션 목록 조회 API
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
