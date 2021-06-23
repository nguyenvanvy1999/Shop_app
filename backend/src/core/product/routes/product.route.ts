import { Router } from 'express';
import { IRoute } from '../../../common/interfaces';
import { uploadMany, uploadOne } from '../../../common/upload';
import { authMiddleware, authRole } from '../../account/middlewares';
import { productController } from '../controllers';
import { ProductCreateVAL, ProductDeleteVAL, ProductUpdateVAL } from '../validators';

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
			.post(authMiddleware, authRole, uploadMany, ProductCreateVAL, productController.create);
		this.routes
			.route('/:id')
			.put(authMiddleware, authRole, uploadMany, ProductUpdateVAL, productController.editProduct)
			.delete(authMiddleware, authRole, ProductDeleteVAL, productController.deleteProduct);
	}
}
