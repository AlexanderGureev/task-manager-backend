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
const path = require("path");
const registerPlugins = (config, server) => __awaiter(this, void 0, void 0, function* () {
    const plugins = config.plugins.map(pluginName => {
        const plugin = require(path.join(__dirname, "plugins", pluginName))[pluginName];
        console.log(`Plugin: ${plugin.name} registered.`);
        return plugin.register(server, config);
    });
    yield Promise.all(plugins);
});
const initServer = (config, db) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield db.connect(config);
        const appServer = new Hapi.Server({
            port: config.PORT,
            host: config.HOST
        });
        yield registerPlugins(config, appServer);
        yield appServer.start();
        console.log("Server running at:", appServer.info.uri);
        return appServer;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.initServer = initServer;
//# sourceMappingURL=server.js.map