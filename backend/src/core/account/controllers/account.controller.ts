import { accountService } from '../services';
import { Request, Response, NextFunction } from 'express';
import { AccountCreateDTO, SignInDTO } from '../dtos';
import { comparePassword, signJwt, signRefreshJwt, verifyJwt } from '../tools';
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
			const newAccount = await accountService.create(account, isAdmin);
			const accesstoken = signJwt(newAccount._id);
			const refreshtoken = signRefreshJwt(newAccount._id);
			res.cookie('refreshtoken', refreshtoken, {
				httpOnly: true,
				path: '/account/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
			});
			return res.json({ accesstoken });
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
			res.cookie('refreshtoken', refreshToken, {
				httpOnly: true,
				path: '/account/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
			});
			return res.status(200).json({ accesstoken: token });
		} catch (error) {
			next(error);
		}
	}
	public async getProfile(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			return res.status(200).json({ ...req.user });
		} catch (error) {
			next(error);
		}
	}
	public async refreshToken(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const accesstoken = signJwt(req.user._id);
			return res.status(200).json({ accesstoken });
		} catch (error) {
			next(error);
		}
	}
	public async logOut(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			res.clearCookie('refreshtoken', { path: '/account/refresh_token' });
			return res.json({ message: 'Logged out' });
		} catch (error) {
			next(error);
		}
	}
}
