import { Router } from 'express';
import { IRoute } from '../../../common/interfaces';
import { uploadOne } from '../../../common/upload';
import { authMiddleware } from '../../account/middlewares';
import { productController } from '../controllers';
import { ProductCreateVAL, ProductUpdateVAL, RemoveImagesVAL } from '../validators';

export class ProductRoute implements IRoute {
	public path = '/product';
	public routes = Router();

	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes() {
		this.routes.post('/', authMiddleware, uploadOne, ProductCreateVAL, productController.create);
		this.routes.get('/type/:type', productController.findByType);
		this.routes.get('/:id', productController.findById);
		this.routes.get('/', productController.findAll);
		this.routes.get('/category/:category', productController.findByCategory);
		this.routes.patch('/add-image', authMiddleware, productController.addImage);
		this.routes.patch('/rm-image', authMiddleware, RemoveImagesVAL, productController.removeImage);
		this.routes.patch('/', authMiddleware, uploadOne, ProductUpdateVAL, productController.editProduct);
	}
}
