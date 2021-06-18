import jwt from 'jsonwebtoken';
import { config } from '../../../common/config';

export const signJwt = (id: string): string => {
	return jwt.sign({ id }, config.secret, { algorithm: 'HS256', expiresIn: '1h' });
};

export const signRefreshJwt = (id: string): string => {
	return jwt.sign({ id }, config.secret, { algorithm: 'HS256', expiresIn: '7d' });
};

export const verifyJwt = (token: string): any => {
	return jwt.verify(token, config.secret);
};
