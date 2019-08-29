import * as Hapi from "@hapi/hapi";
import { config } from "../../config";

export const cookie = {
  name: "cookie",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: object) =>
    server.state("token", {
      ttl: 365 * 24 * 60 * 60 * 1000,
      isSecure: false,
      isHttpOnly: true,
      password: config.COOKIE_SECRET,

      // encoding: "none",
      // clearInvalid: false
      strictHeader: true
      // isSameSite: false
    })
};
