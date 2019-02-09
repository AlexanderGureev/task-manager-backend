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
const Hapi = require("hapi");
const initApp = (config) => __awaiter(this, void 0, void 0, function* () {
    const appServer = new Hapi.Server({
        port: config.port,
        host: config.host
    });
    try {
        yield appServer.start();
    }
    catch (error) {
        throw new Error(error.message);
    }
    return appServer;
});
exports.initApp = initApp;
//# sourceMappingURL=index.js.map