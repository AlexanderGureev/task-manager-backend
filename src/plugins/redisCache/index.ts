import { ResponseToolkit, Server } from "@hapi/hapi";
import { promisifyAll } from "bluebird";
import * as redis from "redis";
import { IConfig } from "../../app/interfaces/common.interface";
import { config } from "../../config";

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
