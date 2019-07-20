import * as Hapi from "hapi";

export const cookie = {
  name: "cookie",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: object) =>
    server.state("token", {
      ttl: 365 * 24 * 60 * 60 * 1000,
      isSecure: false,
      isHttpOnly: true,
      encoding: "none",
      clearInvalid: false
      // strictHeader: true,
      // isSameSite: "Strict",
    })
};
