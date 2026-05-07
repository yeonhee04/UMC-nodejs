export interface UserSignUpRequest {
  email: string;
  password: string; // 비밀번호 추가
  name: string;
  gender: string;
  birth: string;
  address?: string;
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
}

export const bodyToUser = (body: UserSignUpRequest) => {
  // const birth = new Date(body.birth);
  return {
    email: body.email,
    password: body.password,
    name: body.name,
    gender: body.gender,
    birth: body.birth,
    address: body.address || "",
    detailAddress: body.detailAddress || "",
    phoneNumber: body.phoneNumber,
    preferences: body.preferences,
  };
};

export const responseFromUser = (data: { user: any; preferences: any[] }) => {
  const preferCategory = data.preferences.map((p) => p.foodCategory.name);

  return {
    email: data.user.email,
    name: data.user.name,
    preferCategory: preferCategory,
  };
};

export const responseFromUserReviews = (reviews: any[]) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length > 0 ? reviews[reviews.length - 1].id : null,
    },
  };
};
