import { Body, Controller, Path, Post, Route, Tags } from "tsoa";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { createStore } from "../services/store.service.js";
import { StoreCreateRequest, StoreResponse } from "../dtos/store.dto.js";

@Route("regions") // 기본 API 경로 (/regions)
@Tags("Stores") // Swagger 문서 그룹핑
export class StoreController extends Controller {
  // 1. 특정 지역에 가게 추가 API
  @Post("{regionId}/stores") // 세부 경로: /regions/{regionId}/stores
  public async handleCreateStore(
    @Path() regionId: number,
    @Body() body: StoreCreateRequest,
  ): Promise<ApiResponse<StoreResponse>> {
    const result = await createStore(regionId, body);

    return success(result);
  }
}
