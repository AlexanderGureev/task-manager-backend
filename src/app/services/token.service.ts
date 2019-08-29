import * as Boom from "@hapi/boom";
import axios from "axios";
import { IConfig, IDatabase } from "../interfaces/common.interface";
import { IToken, ITokenService } from "../interfaces/token.interface";

export class TokenService implements ITokenService {
  private readonly tokenProviders = {
    google: "https://www.googleapis.com/oauth2/v4/token"
  };

  constructor(
    private readonly db: IDatabase,
    private readonly configService: IConfig
  ) {}

  public async createAccessToken(code, provider) {
    try {
      const token = await this.getGoogleToken(
        code,
        this.tokenProviders[provider]
      );

      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private async getGoogleToken(code, url): Promise<IToken> {
    try {
      const { data, status } = await axios({
        method: "POST",
        url,
        data: {
          code,
          client_id: this.configService.SOCIAL_AUTH.GOOGLE.CLIENT_ID,
          client_secret: this.configService.SOCIAL_AUTH.GOOGLE.CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: this.configService.SOCIAL_AUTH.GOOGLE.REDIRECT_URI
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
