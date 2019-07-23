import * as Boom from "@hapi/boom";
import { Types } from "mongoose";
import { ICategory, ICategoryService, IDatabase } from "../interfaces";

export class CategoryService implements ICategoryService {
  constructor(private db: IDatabase) {}

  public async createCategory(
    { userId },
    category: ICategory
  ): Promise<ICategory> {
    const newCategory = new this.db.categoriesModel(category);
    const user = await this.db.usersModel.findById(userId).exec();

    newCategory.author = Types.ObjectId(user._id);
    user.categories.push(Types.ObjectId(newCategory._id));

    const [savedCategory] = await Promise.all([
      newCategory.save(),
      user.save()
    ]);
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
      .exec();
    return deletedCategory;
  }
}
