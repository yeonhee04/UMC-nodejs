import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  Tags,
  Middlewares,
  Request,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js";
import {
  UserSignUpRequest,
  UserSignUpResponse,
  UserReviewsResponse,
} from "../dtos/user.dto.js";
import { listUserReviews, userSignUp } from "../services/user.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";

@Route("users") // 기본 API 경로
@Tags("Users") // Swagger 문서에서 Users 그룹으로 묶어줌
export class UserController extends Controller {
  // 1. 회원가입 API
  @Post("signup") // 세부 경로: /users/signup
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);

    const user = await userSignUp(body);
    return success(user);
  }

  // 2. 내 리뷰 목록 조회 API
  @Get("{userId}/reviews") // 세부 경로: /users/1/reviews
  public async handleListUserReviews(
    @Path() userId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<UserReviewsResponse>> {
    const actualCursor = cursor || 0;

    const response = await listUserReviews(userId, actualCursor);
    return success(response);
  }

  // A. 누구나 들어올 수 있는 게스트 페이지 (미들웨어 없음)
  @Get("guest")
  public async handleGuestPage(): Promise<ApiResponse<String>> {
    return success(`
      <h1>게스트 페이지</h1>
      <p>이 페이지는 로그인이 필요 없습니다.</p>
      <ul>
        <li><a href="/api/v1/users/mypage">마이페이지(로그인 필요)</a></li>
      </ul>
    `);
  }

  // B. 로그인 페이지 (인증 실패 시 튕겨져 오는 곳)
  @Get("login")
  public async handleLoginPage(): Promise<ApiResponse<String>> {
    return success(
      "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>",
    );
  }

  // C. 미들웨어가 지키고 있는 마이페이지 (인증 필수)
  @Get("mypage")
  @Middlewares(authorizeUser())
  public async handleMypage(
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<String>> {
    return success(`
      <h1>마이페이지</h1>
      <p>환영합니다. ${req.cookies.username}님!</p>
      <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `);
  }

  // D. 강제로 로그인 쿠키를 생성하는 API
  @Get("set-login")
  public async handleSetLogin(
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<String>> {
    req.res!.cookie("username", "UMC10th", { maxAge: 3600000 });
    return success(
      '로그인 쿠키(username=UMC10th) 생성 완료! <a href="/api/v1/users/mypage">마이페이지로 이동</a>',
    );
  }

  // E. 로그아웃 API (쿠키 삭제)
  @Get("set-logout")
  public async handleSetLogout(
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<String>> {
    req.res!.clearCookie("username");
    return success(
      '로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>',
    );
  }
}
