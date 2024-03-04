export interface IUserPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface UserToken {
  accessToken: string;
}

export interface IUserFromJwt {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user: IUserFromJwt;
}
