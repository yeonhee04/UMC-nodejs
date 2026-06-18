import { Body, Controller, Get, Path, Post, Query, Route, Tags, SuccessResponse, Response, Request, Middlewares } from "tsoa";
import { Request as ExpressRequest } from "express";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { createReview, listStoreReviews } from "../services/review.service.js";
import {
  ReviewCreateRequest,
  ReviewResponse,
  ReviewListResponse,
} from "../dtos/review.dto.js";
import passport from "passport";

const isLogin = passport.authenticate("jwt", { session: false });

@Route("stores") // 기본 API 경로 (/stores)
@Tags("Reviews") // Swagger 문서 그룹핑
export class ReviewController extends Controller {

  /**
   * @summary 가게 리뷰 작성 API
   */
  @SuccessResponse("200", "리뷰 작성 성공")
  @Response("400", "잘못된 요청 데이터 (필수값 누락, 점수 범위 초과 등)")
  @Response("404", "요청하신 가게가 존재하지 않습니다.")
  @Post("{storeId}/reviews") // 세부 경로 (/stores/1/reviews)
  @Middlewares(isLogin)
  public async handleCreateReview(
    @Path() storeId: number,
    @Request() req: any,
    @Body() body: ReviewCreateRequest,
  ): Promise<ApiResponse<ReviewResponse>> {

    const userId = req.user.id;
    const result = await createReview(storeId, { ...body, userId });

    return success(result);
  }

  /**
   * 특정 가게(Store)에 작성된 리뷰 목록을 페이징 처리하여 조회합니다.
   * @summary 가게 리뷰 목록 조회 API
   */
  @SuccessResponse("200", "가게 리뷰 목록 조회 성공")
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
