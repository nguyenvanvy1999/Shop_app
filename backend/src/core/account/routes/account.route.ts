import { Router } from 'express';
import { IRoute } from '../../../common/interfaces';
import { uploadOne } from '../../../common/upload';
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
		this.routes.post('/', uploadOne, AccountCreateVAL, accountController.create);
		this.routes.post('/signin', SignInVAL, accountController.singIn);
		this.routes.patch('/password', authMiddleware, UpdatePasswordVAL, accountController.changePassword);
		this.routes.patch('/', authMiddleware, uploadOne, AccountUpdateVAL, accountController.editAccount);
		this.routes.get('/', authMiddleware, accountController.getProfile);
		this.routes.get('/avatar', authMiddleware, accountController.getAvatar);
		this.routes.get('/all', authMiddleware, accountController.getAll);
	}
}
