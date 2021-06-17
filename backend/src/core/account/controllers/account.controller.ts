import { accountService, refreshTokenService } from '../services';
import { Request, Response, NextFunction } from 'express';
import { AccountCreateDTO, AccountUpdateDTO, ForgetPasswordDTO, SignInDTO, UpdatePasswordDTO } from '../dtos';
import { comparePassword, hashPassword, isMaster, signJwt } from '../tools';
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
			return res.status(201).send(newAccount);
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
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				path: '/account/refresh',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
			});
			return res.status(200).json({ accessToken: token });
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
			const token = req.cookies.refreshToken;
			if (!token || !isUUID(token, 4)) throw new HttpException(400, 'Refresh token wrong');
			const isToken = await refreshTokenService.findToken(token);
			if (!isToken) throw new HttpException(400, 'No token found!');
			const accessToken = signJwt(isToken.accountId);
			return res.status(200).json({ accessToken });
		} catch (error) {
			next(error);
		}
	}
	public async logOut(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const { token } = req.params;
			await refreshTokenService.deleteToken(token);
			res.clearCookie('refreshToken', { path: '/account/refresh' });
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
