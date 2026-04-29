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

export const responseFromUser = ({
  user,
  preferences,
}: {
  user: any;
  preferences: any[];
}) => {
  // 선호 카테고리 객체 배열에서 카테고리 이름만 추출
  const preferCategory = preferences.map((preference) => preference.name);

  return {
    email: user.email,
    name: user.name,
    preferCategory,
  };
};
