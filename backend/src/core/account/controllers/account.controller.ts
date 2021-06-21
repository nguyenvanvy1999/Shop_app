import { accountService } from '../services';
import { Request, Response, NextFunction } from 'express';
import { AccountCreateDTO, SignInDTO } from '../dtos';
import { comparePassword, signJwt, signRefreshJwt } from '../tools';
import { HttpException } from '../../../common/exception';
import { RequestWithUser } from '../../base/interfaces';
import { config } from '../../../common/config';

export class AccountController {
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const account: AccountCreateDTO = req.body;
			const accountExits = await accountService.findByUsername(account.username);
			if (accountExits) throw new HttpException(400, 'Username has been exits');
			let isAdmin: boolean;
			account.masterPassword ? (isAdmin = false) : (isAdmin = true);
			isAdmin = comparePassword(account.masterPassword, config.get('master_password'));
			await accountService.create(account, isAdmin);
			return res.json({ message: 'Create successfully!' });
		} catch (error) {
			next(error);
		}
	}
	public async singIn(req: Request, res: Response, next: NextFunction) {
		try {
			const account: SignInDTO = req.body;
			const isAccount = await accountService.findByUsername(account.username);
			if (!isAccount) throw new HttpException(400, 'Username wrong!');
			const isPassword = comparePassword(account.password, isAccount.password);
			if (!isPassword) throw new HttpException(400, 'Password wrong!');
			const token = signJwt(isAccount._id);
			const refreshToken = signRefreshJwt(isAccount._id);
			return res.status(200).json({ accessToken: token, refreshToken });
		} catch (error) {
			next(error);
		}
	}
	public async getProfile(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			return res.status(200).json(req.user);
		} catch (error) {
			next(error);
		}
	}
	public async refreshToken(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const accessToken = signJwt(req.user._id);
			return res.status(200).json({ accessToken });
		} catch (error) {
			next(error);
		}
	}
}
