import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  ICategory,
  ICategoryController,
  ICategoryService
} from "../interfaces/category.interface";

export class CategoryController implements ICategoryController {
  constructor(public categoryService: ICategoryService) {}

  public async createCategory(req: Request, h: ResponseToolkit) {
    try {
      const category: ICategory = await this.categoryService.createCategory(
        req.auth.credentials,
        req.payload as ICategory
      );
      return h.response(category).code(201);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async getCategories(req: Request, h: ResponseToolkit) {
    try {
      const categories = await this.categoryService.getCategories(
        req.auth.credentials
      );
      return h.response(categories).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async getCategoryById(req: Request, h: ResponseToolkit) {
    try {
      const category = await this.categoryService.getCategoryById(
        req.params.id
      );

      return h.response(category).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async updateCategoryById(req: Request, h: ResponseToolkit) {
    try {
      console.log(req.params.id, req.payload as ICategory);
      const updatedCategory = await this.categoryService.updateCategoryById(
        req.params.id,
        req.payload as ICategory
      );
      if (!updatedCategory) {
        return h.response().code(204);
      }
      return h.response(updatedCategory).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async deleteCategoryById(req: Request, h: ResponseToolkit) {
    try {
      const deletedCategory = await this.categoryService.deleteCategoryById(
        req.params.id
      );
      if (!deletedCategory) {
        return h.response().code(204);
      }
      return h.response(deletedCategory).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
