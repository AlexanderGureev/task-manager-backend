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
const config_1 = require("../../config");
const validate = function (decoded, request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield request.redis.getAsync(`${config_1.config.SESSION_PREFIX}:${decoded.id}`);
            if (!session) {
                return { isValid: false };
            }
            return {
                isValid: true,
                credentials: Object.assign({}, decoded)
            };
        }
        catch (error) {
            console.log(error);
            return { isValid: false };
        }
    });
};
exports.auth = {
    name: "auth",
    version: "1.0.0",
    register: (server, options) => __awaiter(this, void 0, void 0, function* () {
        yield server.register(require("hapi-auth-jwt2"));
        server.auth.strategy("jwt", "jwt", {
            key: options.JWT_SECRET,
            validate,
            verifyOptions: { algorithms: ["HS256"] }
        });
        server.auth.default("jwt");
    })
};
//# sourceMappingURL=index.js.map