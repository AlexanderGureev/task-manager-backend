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
const HapiSwagger = require("hapi-swagger");
const Inert = require("inert");
const Vision = require("vision");
exports.swagger = {
    name: "swagger",
    version: "1.0.0",
    register: (server, options) => __awaiter(this, void 0, void 0, function* () {
        const swaggerOptions = {
            documentationPath: "/",
            grouping: "tags",
            sortTags: "name",
            sortEndpoints: "ordered",
            tags: [
                {
                    name: "auth",
                    description: "authentication and authorization"
                },
                {
                    name: "todos",
                    description: "actions on todos"
                }
            ],
            info: {
                title: "API Documentation",
                version: options.API_VERSION
            }
        };
        yield server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ]);
    })
};
//# sourceMappingURL=index.js.map