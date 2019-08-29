import * as Boom from "@hapi/boom";
import axios from "axios";
import { IDatabase } from "../interfaces/common.interface";
import { ISocialAuthService } from "../interfaces/socialAuth.interface";
import { IToken } from "../interfaces/token.interface";
import { IUser, IUserModel, Providers } from "../interfaces/user.interface";

export class SocialAuthService implements ISocialAuthService {
  private readonly API_CONFIG = {
    [Providers.google]: {
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
      getProfile: this.getUserProfileGoogle
    },
    [Providers.vk]: {
      url: "https://api.vk.com/method/users.get",
      getProfile: this.getUserProfileVk
    },
    [Providers.facebook]: {
      url: "https://graph.facebook.com/v4.0/me",
      getProfile: this.getUserProfileFacebook
    }
  };

  constructor(private readonly db: IDatabase) {}
  public async registerOrLogin(
    token: IToken,
    provider: string
  ): Promise<IUser> {
    try {
      const parsedProvider = Providers[provider];
      const { url, getProfile } = this.API_CONFIG[parsedProvider];
      const { username, avatarPath, email } = await getProfile(token, url);

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
  private async getUserProfileFacebook(token, url) {
    const { data, status } = await axios({
      method: "GET",
      url,
      params: {
        access_token: token.access_token,
        fields:
          "first_name, last_name, name, email, picture.width(150).height(150)"
      }
    });
    if (status !== 200) {
      throw Boom.forbidden("Authorization data is not valid");
    }
    return {
      username: data.name,
      avatarPath: data.picture.data.url,
      email: data.email || ""
    };
  }
  private async getUserProfileGoogle(token, url) {
    const { data, status } = await axios({
      method: "GET",
      url,
      params: {
        access_token: token.access_token
      }
    });

    if (status !== 200) {
      throw Boom.forbidden("Authorization data is not valid");
    }
    return { username: data.name, avatarPath: data.picture, email: data.email };
  }
  private async getUserProfileVk(token, url) {
    const { data, status } = await axios({
      method: "GET",
      url,
      params: {
        access_token: token.access_token,
        fields: "photo_200",
        v: "5.101"
      }
    });
    if (status !== 200) {
      throw Boom.forbidden("Authorization data is not valid");
    }

    const [{ first_name, last_name, photo_200: avatarPath }] = data.response;
    return {
      username: `${first_name} ${last_name}`,
      avatarPath,
      email: token.email
    };
  }
}
