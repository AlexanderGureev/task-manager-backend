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
const mongoose = require("mongoose");
const todo_model_1 = require("../models/todo.model");
const user_model_1 = require("../models/user.model");
const connect = (config) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield mongoose.connect(config.MONGO_URI, { useNewUrlParser: true });
        console.log("Connected to database.");
    }
    catch (error) {
        console.log("Unable to connect to database.");
        throw new Error(error.message);
    }
});
exports.database = () => {
    return {
        todosModel: todo_model_1.todosModel,
        usersModel: user_model_1.usersModel,
        connect
    };
};
//# sourceMappingURL=database.js.map