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
class TodoController {
    constructor(todoService) {
        this.todoService = todoService;
    }
    addTodo(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todo = yield this.todoService.addTodo(req.payload);
                return h.response(todo).code(201);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getTodos(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield this.todoService.getTodos(Number(req.query.limit));
                if (!todos.length) {
                    return h.response().code(204);
                }
                return h.response(todos).code(200);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getTodoById(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todo = yield this.todoService.getTodoById(req.params.id);
                if (!todo) {
                    return h.response().code(204);
                }
                return h.response(todo).code(200);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateTodoById(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTodo = yield this.todoService.updateTodoById(req.params.id, req.payload);
                return h.response(updatedTodo).code(200);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteTodoById(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedTodo = yield this.todoService.deleteTodoById(req.params.id);
                if (!deletedTodo) {
                    return h.response().code(204);
                }
                return h.response(deletedTodo).code(200);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.TodoController = TodoController;
//# sourceMappingURL=todo.controller.js.map