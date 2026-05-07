import { prisma } from "../../../db.config.js";

// User 데이터 삽입
export const addUser = async (data: any) => {
  // 1. 이미 존재하는 이메일인지 확인
  const user = await prisma.user.findFirst({ where: { email: data.email } });

  if (user) {
    return null;
  }

  // 2. 새로운 유저 생성
  const created = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    },
  });

  return created.id;
};

// 1. 특정 사용자 조회
export const getUser = async (userId: number) => {
  // findFirstOrThrow: 유저가 없으면 알아서 에러를 던져줍니다. (if문 검사 생략 가능!)
  return await prisma.user.findFirstOrThrow({ where: { id: userId } });
};

// 2. 음식 선호 카테고리 매핑 (INSERT)
export const setPreference = async (userId: number, foodCategoryId: number) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 3. 사용자 선호 카테고리 반환 (JOIN)
export const getUserPreferencesByUserId = async (userId: number) => {
  return await prisma.userFavorCategory.findMany({
    where: { userId: userId },
    include: {
      // 핵심 포인트! 이 한 줄이 복잡한 SQL JOIN 쿼리를 대신합니다.
      foodCategory: true,
    },
    orderBy: { foodCategoryId: "asc" },
  });
};

// 사용자가 작성한 리뷰 목록을 5개씩 가져오는 함수
export const getUserReviews = async (userId: number, cursor: number) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: {
      id: true,
      content: true,
      score: true,
      store: {
        select: {
          name: true,
        },
      },
    },
    where: {
      userId: userId,
      id: { gt: cursor }, // 책갈피(cursor)보다 큰 ID만 가져오기
    },
    orderBy: { id: "asc" },
    take: 5, // 한 번에 5개씩
  });

  return reviews;
};
