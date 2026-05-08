import { AppError } from "./app.error.js";

// 이메일 중복 시 사용할 커스텀 에러 클래스
export class DuplicateUserEmailError extends AppError {
  constructor(message: string, data?: any) {
    super({
      errorCode: "U001",
      statusCode: 409,
      message,
      data,
    });
  }
}

// 가게가 존재하지 않을 때 사용할 커스텀 에러 클래스
export class StoreNotFoundError extends AppError {
  constructor(message: string, data?: any) {
    super({
      errorCode: "S001",
      statusCode: 404,
      message,
      data,
    });
  }
}

// 지역이 존재하지 않을 때 사용할 커스텀 에러 클래스
// export class RegionNotFoundError extends AppError {
//   constructor(message: string, data?: any) {
//     super({
//       errorCode: "R001",
//       statusCode: 404,
//       message,
//       data,
//     });
//   }
// }

// 미션이 존재하지 않을 때 사용할 커스텀 에러 클래스
export class MissionNotFoundError extends AppError {
  constructor(message: string, data?: any) {
    super({ errorCode: "M001", statusCode: 404, message, data });
  }
}

// 이미 도전한 미션에 또 도전하려 할 때 사용할 커스텀 에러 클래스
export class MissionAlreadyChallengedError extends AppError {
  constructor(message: string, data?: any) {
    super({ errorCode: "M002", statusCode: 409, message, data });
  }
}

// 도전 중이지 않은 미션에 인증하려 할 때 사용할 커스텀 에러 클래스
export class MissionNotChallengingError extends AppError {
  constructor(message: string, data?: any) {
    super({ errorCode: "M003", statusCode: 400, message, data });
  }
}
