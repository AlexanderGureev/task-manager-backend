import * as Hapi from "@hapi/hapi";
import { IConfig } from "../../app/interfaces/common.interface";

export const cookie = {
  name: "cookie",
  version: "1.0.0",
  register: async (server: Hapi.Server, config: IConfig) =>
    server.state("token", {
      ttl: 365 * 24 * 60 * 60 * 1000,
      isSecure: false,
      isHttpOnly: true,
      password: config.COOKIE_SECRET,
      encoding: "none",
      clearInvalid: false,
      strictHeader: true,
      isSameSite: false,
      path: "/"
    })
};
