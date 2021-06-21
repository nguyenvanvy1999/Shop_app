import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { HttpException } from './http-error';
import { ErrorRes } from './interfaces';

const handlerError = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
	try {
		const name: string = error.name || 'Internal Server Error';
		const status: number = error.status || 500;
		const message: string = error.message || 'Sorry! Something went wrong';
		const errorRes: ErrorRes = { name, status, message, timestamp: new Date(Date.now()).toLocaleDateString() };
		logger.error(errorRes);
		res.status(status).json({ ...errorRes });
	} catch (error) {
		next(error);
	}
};

const handleNotFoundPage = (req: Request, res: Response) => {
	const errorRes: ErrorRes = {
		name: 'Page not found!',
		status: 404,
		message: `${req.method}${req.url} not found`,
		timestamp: new Date(Date.now()).toLocaleDateString(),
	};
	logger.error(errorRes);
	return res.status(404).json({ ...errorRes });
};

export { handlerError, handleNotFoundPage };
