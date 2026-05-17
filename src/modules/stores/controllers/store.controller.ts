import { Body, Controller, Path, Post, Route, SuccessResponse, Response, Tags } from "tsoa";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { createStore } from "../services/store.service.js";
import { StoreCreateRequest, StoreResponse } from "../dtos/store.dto.js";

@Route("regions") // 기본 API 경로 (/regions)
@Tags("Stores") // Swagger 문서 그룹핑
export class StoreController extends Controller {

  /**
   * 특정 지역(Region)에 새로운 가게(Store) 데이터를 추가합니다.
   * 성공 시 생성된 가게의 고유 ID와 성공 메시지를 반환합니다.
   * @summary 특정 지역에 가게 추가 API
   */
  @SuccessResponse("200", "가게 추가 성공")
  @Response("400", "잘못된 요청 데이터 (필수값 누락 등)")
  @Post("{regionId}/stores") // 세부 경로: /regions/{regionId}/stores
  public async handleCreateStore(
    @Path() regionId: number,
    @Body() body: StoreCreateRequest,
  ): Promise<ApiResponse<StoreResponse>> {
    const result = await createStore(regionId, body);

    return success(result);
  }
}
