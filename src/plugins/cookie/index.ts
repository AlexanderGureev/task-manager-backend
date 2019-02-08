import * as Hapi from "hapi";

export const cookie = {
  name: "cookie",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: object) =>
    server.state("data", {
      ttl: null,
      isSecure: false,
      isHttpOnly: true,
      encoding: "base64json",
      clearInvalid: false,
      strictHeader: true,
      isSameSite: "Strict"
    })
};
