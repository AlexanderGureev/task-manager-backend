import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { IToken } from "./token.interface";
import { IUser } from "./user.interface";

export interface ISocialAuthController {
  registerOrLogin: (
    req: Request,
    h: ResponseToolkit
  ) => Promise<ResponseObject>;
}

export interface ISocialAuthPayload {
  code: string;
  provider: string;
}

export interface ISocialAuthService {
  // registerOrLogin: (token: IToken) => Promise<IUser>;
  registerOrLogin: (token: IToken, provider: string) => Promise<IUser>;
}
