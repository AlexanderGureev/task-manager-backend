import * as JWT from "jsonwebtoken";
import { v4 } from "uuid";
import { IAuthService } from "../interfaces/auth.interface";
import { IConfig } from "../interfaces/common.interface";
import { IUser } from "../interfaces/user.interface";

export class AuthService implements IAuthService {
  constructor(private readonly config: IConfig) {}

  public async deleteSession(req) {
    await req.redis.delAsync(req.auth.credentials.id);
  }
  public async createSession(req, { username, _id }: IUser) {
    const session = {
      username,
      id: v4(),
      userId: _id
    };
    const token = JWT.sign(session, this.config.JWT_SECRET);
    await req.redis.setAsync(
      `${this.config.SESSION_PREFIX}:${session.id}`,
      JSON.stringify(token)
    );
    return token;
  }
}
