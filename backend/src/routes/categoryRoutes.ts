import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);

export default router;
