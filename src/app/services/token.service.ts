import * as Boom from "@hapi/boom";
import axios from "axios";
import { IConfig, IDatabase } from "../interfaces/common.interface";
import { IToken, ITokenService } from "../interfaces/token.interface";
import { Providers } from "../interfaces/user.interface";

export class TokenService implements ITokenService {
  private readonly linksTokenProviders = {
    google: "https://www.googleapis.com/oauth2/v4/token",
    vk: "https://oauth.vk.com/access_token",
    facebook: "https://graph.facebook.com/v4.0/oauth/access_token"
  };

  constructor(private readonly configService: IConfig) {}

  public async createAccessToken(code, provider) {
    try {
      const token = await this.getToken(
        code,
        this.linksTokenProviders[provider],
        Providers[provider]
      );

      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  private async getToken(code, url, provider): Promise<IToken> {
    try {
      const payloadType = provider === Providers.google ? "data" : "params";
      const reqMethod = provider === Providers.facebook ? "GET" : "POST";
      const { data, status } = await axios({
        method: reqMethod,
        url,
        [payloadType]: {
          code,
          client_id: this.configService.SOCIAL_AUTH[provider].CLIENT_ID,
          client_secret: this.configService.SOCIAL_AUTH[provider].CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: this.configService.SOCIAL_AUTH[provider].REDIRECT_URI
        }
      });
      if (status !== 200) {
        throw new Error("The request failed");
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}
