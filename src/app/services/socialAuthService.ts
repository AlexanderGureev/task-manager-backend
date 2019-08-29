import * as Boom from "@hapi/boom";
import axios from "axios";
import { IDatabase } from "../interfaces/common.interface";
import { ISocialAuthService } from "../interfaces/socialAuth.interface";
import { IToken } from "../interfaces/token.interface";
import { IUser, IUserModel, Providers } from "../interfaces/user.interface";

export class SocialAuthService implements ISocialAuthService {
  private readonly SOCIAL_API_URL = {
    [Providers.google]: "https://www.googleapis.com/oauth2/v3/userinfo"
  };
  constructor(private readonly db: IDatabase) {}
  public async registerOrLogin(
    token: IToken,
    provider: string
  ): Promise<IUser> {
    try {
      const parsedProvider = Providers[provider];

      const { username, avatarPath, email } = await this.getUserProfile(
        token.access_token,
        this.SOCIAL_API_URL[parsedProvider]
      );

      const user: IUserModel = await this.db.usersModel
        .findOne({ email })
        .populate({ path: "categories", select: "-todos" })
        .exec();
      if (user && user.provider === parsedProvider) {
        return user;
      }

      const newUser = new this.db.usersModel({
        username,
        avatarPath,
        email,
        provider: parsedProvider
      });
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async getUserProfile(accessToken, url) {
    const { data, status } = await axios({
      method: "GET",
      url,
      params: {
        access_token: accessToken
      }
    });

    if (status !== 200) {
      throw Boom.forbidden("Authorization data is not valid");
    }
    const { name: username, picture: avatarPath, email } = data;
    return { username, avatarPath, email };
  }
}
