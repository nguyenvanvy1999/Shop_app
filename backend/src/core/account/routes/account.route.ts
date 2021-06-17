import { Router } from 'express';
import { IRoute } from '../../../common/interfaces';
import { accountController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { AccountCreateVAL, AccountUpdateVAL, SignInVAL, UpdatePasswordVAL } from '../validators';

export class AccountRoute implements IRoute {
	public path = '/account';
	public routes = Router();
	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes() {
		this.routes.post('/', AccountCreateVAL, accountController.create);
		this.routes.post('/signin', SignInVAL, accountController.singIn);
		this.routes.patch('/password', authMiddleware, UpdatePasswordVAL, accountController.changePassword);
		this.routes.patch('/', authMiddleware, AccountUpdateVAL, accountController.editAccount);
		this.routes.get('/', authMiddleware, accountController.getProfile);
		this.routes.get('/all', authMiddleware, accountController.getAll);
		this.routes.post('/refresh', accountController.refreshToken);
		this.routes.post('/logout', authMiddleware, accountController.logOut);
		this.routes.post('/logout-all', authMiddleware, accountController.logOutAll);
	}
}
