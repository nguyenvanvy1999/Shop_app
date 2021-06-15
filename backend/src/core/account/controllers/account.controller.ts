import { accountService } from '../services';
import { Request, Response, NextFunction } from 'express';
import { AccountCreateDTO, SignInDTO } from '../dtos';
import { comparePassword, hashPassword, signJwt } from '../tools';
import { HttpException } from '../../../common/exception';
import { RequestWithUser } from '../../base/interfaces';
import { config } from '../../../common/config';
import { imageService } from '../../image/services';
import fs from 'fs';
import { uploadOne } from '../../../common/upload';
import { IImage } from '../../image/interfaces/image.interface';
import path from 'path';

export class AccountController {
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			await uploadOne(req, res);
			let image: IImage;
			if (req.file) {
				const { filename: name, path } = req.file;
				image = await imageService.create({ name, path });
			}
			const account: AccountCreateDTO = req.body;
			if (!comparePassword(account?.masterPassword, config.get('master_password')))
				throw new HttpException(403, 'No permission!');
			const newAccount = await accountService.create(account, image ? image._id : undefined);
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
			return res.status(200).send({ token });
		} catch (error) {
			next(error);
		}
	}
	public async changePassword(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const { password } = req.body;
			const account = req.user;
			account.password = hashPassword(password);
			await account.save();
			return res.status(200).send({ message: 'Changer successfully!' });
		} catch (error) {
			next(error);
		}
	}
	public async getAvatar(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const image = await imageService.findById(req.user.avatarId);
			if (!fs.existsSync(image.path)) throw new HttpException(500, 'Image wrong!');
			const dir = path.join(__dirname, '../../../../', image.path);
			return res.status(200).sendFile(dir);
		} catch (error) {
			next(error);
		}
	}
	public async editAccount(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			await uploadOne(req, res);
			let image: IImage;
			if (req.file) {
				const { filename: name, path } = req.file;
				image = await imageService.create({ name, path });
			}
			const account = await accountService.edit(req.user._id, {
				fullName: req.body.fullName,
				avatarId: image ? image._id : undefined,
			});
			return res.status(200).send({ account });
		} catch (error) {
			next(error);
		}
	}
	public async getProfile(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			return res.status(200).send({ account: req.user });
		} catch (error) {
			next(error);
		}
	}
	public async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const accounts = await accountService.findAll();
			return res.status(200).send({ accounts });
		} catch (error) {
			next(error);
		}
	}
}
