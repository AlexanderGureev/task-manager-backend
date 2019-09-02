import * as Boom from "@hapi/boom";
import { Types } from "mongoose";
import {
  CategoryEvents,
  ICreateCategoryEventPayload,
  IDeleteCategoryEventPayload
} from "../interfaces/category.interface";
import { IDatabase } from "../interfaces/common.interface";
import { IEventBus } from "../interfaces/eventBus.interface";
import {
  IAddTodoEventPayload,
  IDeleteTodoEventPayload,
  IUpdateTodoEventPayload,
  TodoEvents
} from "../interfaces/todo.interface";
import { IUser, IUserModel, IUserService } from "../interfaces/user.interface";

export class UserService implements IUserService {
  constructor(
    private readonly db: IDatabase,
    private readonly eventBus: IEventBus
  ) {
    this.eventBus.subscribe(
      TodoEvents.CREATE_TODO_EVENT,
      this.addTodoEventHandler.bind(this)
    );
    this.eventBus.subscribe(
      TodoEvents.UPDATE_TODO_EVENT,
      this.updateTodoEventHandler.bind(this)
    );
    this.eventBus.subscribe(
      TodoEvents.DELETE_TODO_EVENT,
      this.deleteTodoEventHandler.bind(this)
    );
    this.eventBus.subscribe(
      CategoryEvents.DELETE_CATEGORY_EVENT,
      this.deleteCategoryEventHandler.bind(this)
    );
    this.eventBus.subscribe(
      CategoryEvents.CREATE_CATEGORY_EVENT,
      this.createCategoryEventHandler.bind(this)
    );
  }

  public async register(user: IUser) {
    const newUser = new this.db.usersModel(user);
    const hashPassword = await newUser.hashPassword(user.password);
    newUser.password = hashPassword;
    return newUser.save();
  }
  public async login({ email, password }) {
    const user: IUserModel = await this.db.usersModel
      .findOne({ email })
      .populate({ path: "categories", select: "-todos" })
      .exec();
    if (!user) {
      throw Boom.forbidden("User not found.");
    }
    const isValid = await user.comparePassword(user.password, password);
    if (!isValid) {
      throw Boom.forbidden("Invalid credentials");
    }

    return user;
  }
  public async getUserProfile(userId) {
    const user: IUserModel = await this.db.usersModel
      .findOne({ _id: userId })
      .populate({ path: "categories", select: "-todos" })
      .exec();
    if (!user) {
      throw Boom.notFound("User not found.");
    }
    return user;
  }
  public async updateUserById(userId, body) {
    const user: IUserModel = await this.db.usersModel
      .findByIdAndUpdate(userId, { ...body }, { new: true })
      .exec();
    return user;
  }

  private async addTodoEventHandler({ userId, todo }: IAddTodoEventPayload) {
    try {
      const user = await this.db.usersModel.findById(userId).exec();

      const updatedStat = {
        ...user.statistics,
        count: user.statistics.count + 1,
        primary: todo.primary
          ? user.statistics.primary + 1
          : user.statistics.primary
      };

      user.statistics = updatedStat;
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }
  private async updateTodoEventHandler({
    userId,
    todo
  }: IUpdateTodoEventPayload) {
    try {
      const user = await this.db.usersModel.findById(userId).exec();

      const updatedStat = {
        ...user.statistics,
        completed:
          todo.status === "completed"
            ? user.statistics.completed + 1
            : user.statistics.completed - 1
      };

      user.statistics = updatedStat;
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }
  private async deleteTodoEventHandler({
    userId,
    todo
  }: IDeleteTodoEventPayload) {
    try {
      const user = await this.db.usersModel.findById(userId).exec();

      const updatedStat = {
        count: user.statistics.count - 1,
        completed:
          todo.status === "completed"
            ? user.statistics.completed - 1
            : user.statistics.completed,
        primary: todo.primary
          ? user.statistics.primary - 1
          : user.statistics.primary
      };

      user.statistics = updatedStat;
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }
  private async deleteCategoryEventHandler({
    userId,
    categoryId,
    todos
  }: IDeleteCategoryEventPayload) {
    try {
      const user = await this.db.usersModel.findById(userId).exec();

      const updatedStat = todos.reduce((acc, todo) => {
        return {
          count: acc.count - 1,
          primary: todo.primary ? acc.primary - 1 : acc.primary,
          completed:
            todo.status === "completed" ? acc.completed - 1 : acc.completed
        };
      }, user.statistics);
      const updatedCategories = user.categories.filter(
        id => id.toString() !== categoryId.toString()
      );

      user.statistics = updatedStat;
      user.categories = updatedCategories;
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }
  private async createCategoryEventHandler({
    userId,
    category
  }: ICreateCategoryEventPayload) {
    try {
      const user = await this.db.usersModel.findById(userId).exec();
      user.categories.push(Types.ObjectId(category._id));
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }
}
