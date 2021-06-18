import { NextFunction, Response, Request } from 'express';
import { HttpException } from '../../../common/exception';
import { joiJWT } from '../../../common/validators';
import { RequestWithUser } from '../../base/interfaces';
import { IToken } from '../interfaces';
import { accountService } from '../services';
import { verifyJwt } from '../tools';

const schema = joiJWT.jwt();

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
	try {
		const token = extractToken(req);
		if (!token) throw new HttpException(401, 'No token found !');
		await schema.validateAsync(token);
		const decoded = verifyJwt(token) as IToken;
		const account = await accountService.findById(decoded.id);
		if (!account) throw new HttpException(401, 'No account found !');
		req.user = account;
		next();
	} catch (error) {
		next(error);
	}
};

function extractToken(req: Request): any {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1];
	} else if (req.query.token) {
		return req.query.token;
	} else if (req.headers.Authorization) return req.headers.Authorization;
	else if (req.header('Authorization')) return req.header('Authorization');
	else if (req.headers.cookie) return req.headers.cookie;
	return null;
}
