import { NextFunction, Response } from 'express';
import { HttpException } from '../../../common/exception';
import { RequestWithUser } from '../../base/interfaces';

export const authRole = (req: RequestWithUser, res: Response, next: NextFunction) => {
	try {
		const account = req.user;
		if (account.role === 0) throw new HttpException(415, 'No permission!');
		next();
	} catch (error) {
		next(error);
	}
};
