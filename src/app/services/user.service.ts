import * as Boom from "@hapi/boom";
import { IDatabase } from "../interfaces/common.interface";
import { IUser, IUserModel, IUserService } from "../interfaces/user.interface";

export class UserService implements IUserService {
  constructor(private db: IDatabase) {}

  public async register(user: IUser) {
    const newUser = await new this.db.usersModel(user);
    const hashPassword = await newUser.hashPassword(user.password);
    newUser.password = hashPassword;
    return newUser.save();
  }
  public async login({ email, password }) {
    const user: IUserModel = await this.db.usersModel.findOne({ email }).exec();
    if (!user) {
      throw Boom.forbidden("User not found.");
    }
    const isValid = await user.comparePassword(user.password, password);
    if (!isValid) {
      throw Boom.forbidden("Invalid credentials");
    }

    return user;
  }
  public async getUserProfile({ userId }) {
    const user: IUserModel = await this.db.usersModel
      .findOne({ _id: userId })
      .exec();
    if (!user) {
      throw Boom.forbidden("User not found.");
    }

    return user;
  }
}
