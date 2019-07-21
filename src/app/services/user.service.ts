import * as Boom from "@hapi/boom";
import { IDatabase, IUser, IUserModel, IUserService } from "../interfaces";

export class UserService implements IUserService {
  constructor(private db: IDatabase) {}

  public async register(user: IUser) {
    try {
      const newUser = await new this.db.usersModel(user);
      const hashPassword = await newUser.hashPassword(user.password);
      newUser.password = hashPassword;
      return newUser.save();
    } catch (error) {
      throw error;
    }
  }
  public async login({ email, password }) {
    try {
      const user: IUserModel = await this.db.usersModel
        .findOne({ email })
        .exec();
      if (!user) {
        throw Boom.forbidden("User not found.");
      }
      const isValid = await user.comparePassword(user.password, password);
      if (!isValid) {
        throw Boom.forbidden("Invalid credentials");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
  public async getUserProfile({ userId }) {
    try {
      const user: IUserModel = await this.db.usersModel
        .findOne({ _id: userId })
        .exec();
      if (!user) {
        throw Boom.forbidden("User not found.");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
