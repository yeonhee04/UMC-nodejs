import { Body, Controller, Get, Path, Post, Query, Route, Tags } from "tsoa";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { createReview, listStoreReviews } from "../services/review.service.js";
import {
  ReviewCreateRequest,
  ReviewResponse,
  ReviewListResponse,
} from "../dtos/review.dto.js";

@Route("stores") // 기본 API 경로 (/stores)
@Tags("Reviews") // Swagger 문서 그룹핑
export class ReviewController extends Controller {
  // 1. 가게 리뷰 작성 API
  @Post("{storeId}/reviews") // 세부 경로 (/stores/1/reviews)
  public async handleCreateReview(
    @Path() storeId: number,
    @Body() body: ReviewCreateRequest,
  ): Promise<ApiResponse<ReviewResponse>> {
    const result = await createReview(storeId, body);

    return success(result);
  }

  // 2. 가게 리뷰 목록 조회 API
  @Get("{storeId}/reviews")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<ReviewListResponse>> {
    const actualCursor = cursor || 0;

    const response = await listStoreReviews(storeId, actualCursor);

    return success(response);
  }
}
