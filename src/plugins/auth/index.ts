import * as Hapi from "hapi";
import { IConfig } from "../../interfaces";

const people = {
  1: {
    id: 1,
    name: "Jen Jones"
  }
};

const validate = async function(decoded, request) {
  console.log(request.redis);
  if (!people[decoded.id]) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

export const auth = {
  name: "auth",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: IConfig) => {
    await server.register(require("hapi-auth-jwt2"));

    server.auth.strategy("jwt", "jwt", {
      key: options.JWT_KEY,
      validate,
      verifyOptions: { algorithms: ["HS256"] }
    });

    server.auth.default("jwt");
  }
};
