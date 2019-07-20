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
class TodoService {
    constructor(db) {
        this.db = db;
        this.addTodo = (todo) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newTodo = new this.db.todosModel(Object.assign({}, todo));
                return yield newTodo.save();
            }
            catch (error) {
                throw error;
            }
        });
        this.getTodos = (limit) => __awaiter(this, void 0, void 0, function* () {
            try {
                const allTodos = yield this.db.todosModel
                    .find({})
                    .limit(limit)
                    .exec();
                return allTodos;
            }
            catch (error) {
                throw error;
            }
        });
        this.getTodoById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const todoById = yield this.db.todosModel.findById(id).exec();
                return todoById;
            }
            catch (error) {
                throw error;
            }
        });
        this.updateTodoById = (id, todo) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTodo = yield this.db.todosModel
                    .findByIdAndUpdate(id, Object.assign({}, todo), { new: true })
                    .exec();
                return updatedTodo;
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteTodoById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedTodo = yield this.db.todosModel
                    .findByIdAndDelete(id)
                    .exec();
                return deletedTodo;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.TodoService = TodoService;
//# sourceMappingURL=todo.service.js.map