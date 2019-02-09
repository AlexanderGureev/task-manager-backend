import { promisifyAll } from "bluebird";
import { ResponseToolkit, Server } from "hapi";
import * as redis from "redis";
import { config } from "../../config";
import { IConfig } from "../../interfaces";

promisifyAll(redis.RedisClient.prototype);
const client = redis.createClient(config.REDIS_URI);

export const redisCache = {
  name: "redisCache",
  version: "1.0.0",
  register: async (server: Server, options: IConfig) => {
    server.ext("onPreAuth", (req: any, h: ResponseToolkit) => {
      req.redis = client;
      return h.continue;
    });
  }
};
