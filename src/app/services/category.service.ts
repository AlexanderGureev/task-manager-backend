import * as Boom from "@hapi/boom";
import { Types } from "mongoose";
import {
  CategoryEvents,
  ICategory,
  ICategoryService
} from "../interfaces/category.interface";
import { IDatabase } from "../interfaces/common.interface";
import { IEventBus } from "../interfaces/eventBus.interface";
import { getCategoryColor } from "../libs/colors";

export class CategoryService implements ICategoryService {
  constructor(
    private readonly db: IDatabase,
    private readonly eventBus: IEventBus
  ) {}

  public async createCategory(
    { userId },
    category: ICategory
  ): Promise<ICategory> {
    const newCategory = new this.db.categoriesModel({
      ...category,
      color: getCategoryColor()
    });
    newCategory.author = Types.ObjectId(userId);
    const savedCategory = await newCategory.save();

    this.eventBus.publish(CategoryEvents.CREATE_CATEGORY_EVENT, {
      userId,
      category: savedCategory
    });
    return savedCategory;
  }
  public async getCategories({ userId }): Promise<ICategory[]> {
    const categories = await this.db.categoriesModel
      .find({ author: userId }, "-todos")
      .exec();
    return categories;
  }
  public async getCategoryById(id): Promise<ICategory> {
    const category = await this.db.categoriesModel
      .findById(id, "-todos")
      .exec();
    if (!category) {
      throw Boom.notFound("Category for this ID do not exist.");
    }
    return category;
  }
  public async updateCategoryById(id, categoryData): Promise<ICategory> {
    const updatedCategory = await this.db.categoriesModel
      .findByIdAndUpdate(id, { ...categoryData }, { new: true })
      .exec();
    return updatedCategory;
  }
  public async deleteCategoryById(id): Promise<ICategory> {
    const deletedCategory = await this.db.categoriesModel
      .findByIdAndDelete(id)
      .populate("todos")
      .exec();

    await this.db.todosModel.deleteMany({ categoryId: id }).exec();

    this.eventBus.publish(CategoryEvents.DELETE_CATEGORY_EVENT, {
      userId: deletedCategory.author,
      categoryId: deletedCategory._id,
      todos: deletedCategory.todos
    });
    return deletedCategory;
  }
}
