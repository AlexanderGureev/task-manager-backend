import * as mongoose from "mongoose";
import { ISocialAuthPayload } from "./socialAuth.interface";

export interface ITokenModel extends mongoose.Document {
  _id: string;
  accessToken: string;
  expiresIn: number;
  expiresAt: Date;
  userId: mongoose.Types.ObjectId;
  provider: string;
}

export interface IToken {
  access_token: string;
  expires_in: number;
  provider?: string;
}

export interface ITokenService {
  createAccessToken: (
    code: string,
    provider: string
  ) => Promise<IToken> | Promise<null>;
  // getAccessToken: (userId: string) => Promise<IToken>;
  // saveAccessToken: (token: IToken) => Promise<IToken>;
}
