import { Request, ResponseToolkit } from "hapi";
import { ITodo, ITodoController, ITodoService } from "../../interfaces";

export class TodoController implements ITodoController {
  constructor(public todoService: ITodoService) {}

  public async addTodo(req: Request, h: ResponseToolkit) {
    try {
      const todo: ITodo = await this.todoService.addTodo(req.payload as ITodo);
      return h.response(todo).code(201);
    } catch (error) {
      console.log(error);
    }
  }
  public async getTodos(req: Request, h: ResponseToolkit) {
    try {
      const todos = await this.todoService.getTodos(Number(req.query.limit));
      if (!todos.length) {
        return h.response().code(204);
      }
      return h.response(todos).code(200);
    } catch (error) {
      console.log(error);
    }
  }
  public async getTodoById(req: Request, h: ResponseToolkit) {
    try {
      const todo = await this.todoService.getTodoById(req.params.id);
      if (!todo) {
        return h.response().code(204);
      }
      return h.response(todo).code(200);
    } catch (error) {
      console.log(error);
    }
  }
  public async updateTodoById(req: Request, h: ResponseToolkit) {
    try {
      const updatedTodo = await this.todoService.updateTodoById(
        req.params.id,
        req.payload as ITodo
      );
      return h.response(updatedTodo).code(200);
    } catch (error) {
      console.log(error);
    }
  }
  public async deleteTodoById(req: Request, h: ResponseToolkit) {
    try {
      const deletedTodo = await this.todoService.deleteTodoById(req.params.id);
      if (!deletedTodo) {
        return h.response().code(204);
      }
      return h.response(deletedTodo).code(200);
    } catch (error) {
      console.log(error);
    }
  }
}
