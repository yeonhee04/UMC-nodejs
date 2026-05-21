import bcrypt from "bcrypt";
import {
  UserSignUpRequest,
  UserSignUpResponse,
  UserReviewsResponse,
} from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  getUserReviews,
  setPreference,
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../../../common/errors/error.js";
import { prisma } from "../../../db.config.js";

// 1. 회원가입 서비스 함수
export const userSignUp = async (
  data: UserSignUpRequest,
): Promise<UserSignUpResponse> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword,
    name: data.name,
    gender: data.gender,
    birth: new Date(data.birth),
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", {
      email: data.email,
    });
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  const preferCategory = preferences.map((p: any) => p.foodCategory.name);

  return <UserSignUpResponse>{
    email: user.email,
    name: user.name,
    preferCategory: preferCategory,
  };
};

// 2. 내 리뷰 목록 조회 서비스 함수
export const listUserReviews = async (
  userId: number,
  cursor: number,
): Promise<UserReviewsResponse> => {
  const reviews = (await getUserReviews(userId, cursor)) || [];

  return <UserReviewsResponse>{
    data: reviews,
    pagination: {
      cursor: reviews.length > 0 ? reviews[reviews.length - 1]!.id : null,
    },
  };
};

// 3. 회원 정보 수정 서비스 함수
export const updateUserInfo = async (userId: number, body: any) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: body.name,
      gender: body.gender,
      birth: body.birth ? new Date(body.birth) : undefined,
      address: body.address,
      detailAddress: body.detailAddress,
      phoneNumber: body.phoneNumber,
    },
    select: {
      id: true,
      email: true,
      name: true,
    }
  });
};