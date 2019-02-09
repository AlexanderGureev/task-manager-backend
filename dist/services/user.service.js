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
class UserService {
    constructor(db) {
        this.db = db;
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield new this.db.usersModel(user);
                const hashPassword = yield newUser.hashPassword(user.password);
                newUser.password = hashPassword;
                return newUser.save();
            }
            catch (error) {
                throw error;
            }
        });
    }
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.db.usersModel
                    .findOne({ email })
                    .exec();
                if (!user) {
                    throw Boom.forbidden("User not found.");
                }
                const isValid = yield user.comparePassword(user.password, password);
                if (!isValid) {
                    throw Boom.forbidden("Invalid credentials");
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map