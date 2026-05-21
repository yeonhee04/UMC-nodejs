// src/auth.config.ts
import dotenv from "dotenv";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import { prisma } from "./db.config.js";

dotenv.config();

// [1] JWT 토큰 생성 함수 (Access: 1시간, Refresh: 14일)
export const generateAccessToken = (user: { id: number; email: string }) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

export const generateRefreshToken = (user: { id: number }) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "14d" });
};

// [2] Google 프로필 정보를 받아 DB와 연동하는 Verify 로직
const googleVerify = async (profile: Profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new Error("Google 프로필에 이메일이 없습니다.");

  // 기존에 가입된 이메일이 있는지 확인
  let user = await prisma.user.findFirst({ where: { email } });

  // 없다면 구글 정보로 자동 회원가입 진행
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: "",
        name: profile.displayName || "구글유저",
        gender: "추후 수정",
        birth: new Date(1970, 0, 1),
        address: "추후 수정",
        detailAddress: "추후 수정",
        phoneNumber: "추후 수정",
      },
    });
  }

  return { id: user.id, email: user.email, name: user.name };
};

// [3] Passport 구글 전략(Strategy) 설정
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },
  async (_accessToken, _refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);
      const tokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
      return cb(null, tokens); // 성공 시 req.user에 토큰 정보가 담김.
    } catch (err) {
      return cb(err as Error);
    }
  }
);

// [4] API 요청 시 들어오는 JWT 토큰(Bearer)을 검증하는 전략 설정
export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <토큰> 형태 추출
    secretOrKey: process.env.JWT_SECRET!,
  },
  async (payload, done) => {
    try {
      // 토큰 페이로드에 적힌 id로 실제 유저가 있는지 검사
      const user = await prisma.user.findFirst({ where: { id: payload.id } });
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);