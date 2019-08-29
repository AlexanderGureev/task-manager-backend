import * as path from "path";
import { IConfig, IMongoConnection } from "../app/interfaces/common.interface";

const mongodbConfig: IMongoConnection = {
  username: encodeURIComponent("test"),
  password: encodeURIComponent("test"),
  database: "test"
};

export const config: IConfig = {
  PORT: process.env.PORT || "8080",
  HOST: process.env.HOST || "0.0.0.0",
  ENV: process.env.ENV || "development",
  SESSION_PREFIX: "session",
  JWT_SECRET: "test",
  API_VERSION: "1.0.0",
  MONGO_URI:
    process.env.MONGO_URI ||
    `mongodb://${mongodbConfig.username}:${mongodbConfig.password}@localhost:27017/${mongodbConfig.database}`,
  REDIS_URI: process.env.REDIS_URI || `redis://localhost:6379`,
  plugins: ["swagger", "logger", "cookie", "auth", "redisCache", "cors"],
  PUBLIC_DIR: path.join(__dirname, "..", "upload"),
  COOKIE_SECRET: process.env.COOKIE_SECRET || `test`,
  SOCIAL_AUTH: {
    GOOGLE: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI
    },
    VK: {
      CLIENT_ID: process.env.VK_CLIENT_ID,
      CLIENT_SECRET: process.env.VK_CLIENT_SECRET,
      REDIRECT_URI: process.env.VK_REDIRECT_URI
    },
    FACEBOOK: {
      CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
      CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
      REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI
    }
  }
};
