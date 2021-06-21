import { Router } from 'express';
import { IRoute } from '../../../common/interfaces';
import { uploadOne } from '../../../common/upload';
import { authMiddleware, authRole } from '../../account/middlewares';
import { productController } from '../controllers';
import { ProductCreateVAL, ProductUpdateVAL, RemoveImagesVAL } from '../validators';

export class ProductRoute implements IRoute {
	public path = '/product';
	public routes = Router();

	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes() {
		this.routes
			.route('/')
			.get(productController.getAll)
			.post(authMiddleware, uploadOne, ProductCreateVAL, productController.create);
		this.routes
			.route('/:id')
			.put(authMiddleware, authRole, productController.editProduct)
			.delete(authMiddleware, authRole, productController.deleteProduct);
		this.routes.post('/upload', authMiddleware, authRole, productController.upload);
		this.routes.post('/destroy', authMiddleware, authRole, productController.destroy);
	}
}
