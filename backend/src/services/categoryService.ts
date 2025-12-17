import { db } from '../db';
import { categories } from '../db/schema';
import { eq } from 'drizzle-orm';

export class CategoryService {
  async getAllCategories() {
    return await db.select().from(categories);
  }

  async getCategoryById(categoryId: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    return category || null;
  }

  async getCategoryBySlug(slug: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    return category || null;
  }
}

export const categoryService = new CategoryService();
