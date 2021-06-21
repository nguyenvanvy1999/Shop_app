import { Router } from 'express';
import { IRoute } from '../../../common/interfaces';
import { accountController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { AccountCreateVAL, SignInVAL } from '../validators';

export class AccountRoute implements IRoute {
	public path = '/account';
	public routes = Router();
	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes() {
		this.routes.post('/', AccountCreateVAL, accountController.create);
		this.routes.post('/signin', SignInVAL, accountController.singIn);
		this.routes.get('/', authMiddleware, accountController.getProfile);
		this.routes.get('/refresh_token', authMiddleware, accountController.refreshToken);
	}
}
