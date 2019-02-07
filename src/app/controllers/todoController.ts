import { Request, ResponseToolkit } from "hapi";
import { ITodo, ITodoController, ITodoService } from "../../interfaces";

export class TodoController implements ITodoController {
  constructor(public todoService: ITodoService) {}

  public async addTodo(req: Request, h: ResponseToolkit) {
    try {
      const todo: ITodo = await this.todoService.addTodo(req.payload as ITodo);
      return h.response({ id: todo._id }).code(201);
    } catch (error) {
      console.log(error);
    }
  }
  public async getTodos(req: Request, h: ResponseToolkit) {
    try {
      const todos = await this.todoService.getTodos();
      return h.response({ todos }).code(200);
    } catch (error) {
      console.log(error);
    }
  }
}
