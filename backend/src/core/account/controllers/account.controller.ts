import { accountService, refreshTokenService } from '../services';
import { Request, Response, NextFunction } from 'express';
import { AccountCreateDTO, AccountUpdateDTO, ForgetPasswordDTO, SignInDTO, UpdatePasswordDTO } from '../dtos';
import { comparePassword, hashPassword, isMaster, signJwt, signRefreshJwt, verifyJwt } from '../tools';
import { HttpException } from '../../../common/exception';
import { RequestWithUser } from '../../base/interfaces';
import { config } from '../../../common/config';
import { isUUID } from 'class-validator';

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
			const refreshToken = await refreshTokenService.createToken(isAccount._id);
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
	public async changePassword(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const body: UpdatePasswordDTO = req.body;
			const account = req.user;
			account.password = hashPassword(body.newPassword);
			await account.save();
			return res.status(200).json({ message: 'Changer successfully!' });
		} catch (error) {
			next(error);
		}
	}
	public async editAccount(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const { _id } = req.user;
			let update: AccountUpdateDTO = { ...req.body };
			const account = await accountService.edit(_id, update);
			return res.status(200).json({ account });
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
	public async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const accounts = await accountService.findAll();
			return res.status(200).json({ accounts });
		} catch (error) {
			next(error);
		}
	}
	public async forgetPassword(req: Request, res: Response, next: NextFunction) {
		try {
			const data: ForgetPasswordDTO = req.body;
			const account = await accountService.findByUsername(data.username);
			if (!account) throw new HttpException(400, 'Username wrong!');
			if (!isMaster) throw new HttpException(400, 'Master password wrong!');
			await accountService.editPassword(account._id, data.newPassword);
			return res.status(200).json({ message: 'Successfully!' });
		} catch (error) {
			next(error);
		}
	}
	public async refreshToken(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.cookies.refreshtoken;
			if (!token) return res.status(400).json({ msg: 'Please Login or Register' });
			const decoded = verifyJwt(token);
			const accesstoken = signJwt(decoded.id);
			return res.status(200).json({ accesstoken });
		} catch (error) {
			next(error);
		}
	}
	public async logOut(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const { token } = req.params;
			await refreshTokenService.deleteToken(token);
			res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
			return res.status(200).json({ message: 'LogOut successfully!' });
		} catch (error) {
			next(error);
		}
	}
	public async logOutAll(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const { _id } = req.user;
			await refreshTokenService.deleteToken(_id);
			return res.status(200).json({ message: 'LogOut all successfully!' });
		} catch (error) {
			next(error);
		}
	}
}
