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
const Boom = require("boom");
const JWT = require("jsonwebtoken");
const uuid_1 = require("uuid");
const config_1 = require("../../config");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    register(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.register(req.payload);
                const token = yield this.createSession(req, user);
                return h
                    .response(user)
                    .code(201)
                    .state("token", token);
            }
            catch (error) {
                let err;
                if (error.name && error.name === "MongoError") {
                    err = Boom.forbidden("User with such data already exists.");
                }
                return err || error;
            }
        });
    }
    login(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.login(req.payload);
                const token = yield this.createSession(req, user);
                return h
                    .response(user)
                    .code(201)
                    .state("token", token);
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    logout(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.deleteSession(req);
                return h
                    .response()
                    .unstate("token")
                    .code(204);
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    deleteSession(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield req.redis.delAsync(req.auth.credentials.id);
        });
    }
    createSession(req, { username, _id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = {
                username,
                id: uuid_1.v4(),
                userId: _id
            };
            const token = JWT.sign(session, config_1.config.JWT_SECRET);
            yield req.redis.setAsync(`${config_1.config.SESSION_PREFIX}:${session.id}`, JSON.stringify(token));
            return token;
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map