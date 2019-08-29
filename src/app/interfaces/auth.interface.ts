import { Request } from "@hapi/hapi";
import { IUser } from "./user.interface";

export interface IAuthService {
  deleteSession: (req: Request) => Promise<any>;
  createSession: (req: Request, user: IUser) => Promise<string>;
}
