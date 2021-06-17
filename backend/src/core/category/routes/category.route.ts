import { Router } from 'express';
import { IRoute } from '../../../common/interfaces';
import { authMiddleware, authRole } from '../../account/middlewares';
import { categoryController } from '../controllers';

export class CategoryRoute implements IRoute {
	public path = '/category';
	public routes = Router();
	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes() {
		this.routes.use(authMiddleware, authRole);
		this.routes.route('/').get(categoryController.get).post(categoryController.create);
		this.routes.route('/:id').delete(categoryController.delete).put(categoryController.updateCategory);
	}
}
