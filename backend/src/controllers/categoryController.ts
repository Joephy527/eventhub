import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';
import { sendSuccess } from '../utils/response';

export class CategoryController {
  async getAllCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();
      sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      sendSuccess(res, category, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await categoryService.getCategoryBySlug(slug);
      sendSuccess(res, category, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
