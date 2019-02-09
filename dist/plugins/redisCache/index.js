"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
const redis = require("redis");
const config_1 = require("../../config");
bluebird_1.promisifyAll(redis.RedisClient.prototype);
const client = redis.createClient(config_1.config.REDIS_URI);
exports.redisCache = {
    name: "redisCache",
    version: "1.0.0",
    register: (server, options) => __awaiter(this, void 0, void 0, function* () {
        server.ext("onPreAuth", (req, h) => {
            req.redis = client;
            return h.continue;
        });
    })
};
//# sourceMappingURL=index.js.map