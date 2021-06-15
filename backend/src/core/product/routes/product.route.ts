import { Router } from 'express';
import { IRoute } from '../../../common/interfaces';
import { authMiddleware } from '../../account/middlewares';
import { productController } from '../controllers';

export class ProductRoute implements IRoute {
	public path = '/product';
	public routes = Router();

	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes() {
		this.routes.post('/', authMiddleware, productController.create);
		this.routes.get('/type/:type', productController.findByType);
		this.routes.get('/:id', productController.findById);
		this.routes.patch('/add-image', productController.addImage);
		this.routes.patch('/rm-image', productController.removeImage);
	}
}
