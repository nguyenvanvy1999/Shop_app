import express from 'express';
import { config } from './common/config';
import { logger, stream } from './common/logger';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import serveFavicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import { IRoute } from './common/interfaces';
import { mongoConfig } from './common/mongo';
import { handleNotFoundPage, handlerError } from './common/exception';

export class App {
	public app: express.Application;
	public port: string | number;
	public env: string;

	constructor(routes: IRoute[]) {
		this.app = express();
		this.port = config.get('port');
		this.env = config.get('node_env');
		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}
	public listen() {
		this.app.listen(this.port, () => {
			logger.info(`App listening on the port ${this.port}`);
		});
	}
	private async connectToDatabase() {
		await mongoConfig.connect();
	}
	private initializeMiddlewares() {
		if (this.env === 'prod') {
			this.app.use(morgan('combined', { stream }));
			this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
		} else if (this.env === 'dev') {
			this.app.use(morgan('dev'));
			this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream }));
			this.app.use(cors({ origin: true, credentials: true }));
		}
		this.app.use(helmet());
		this.app.use(express.static(path.join(__dirname, '../public')));
		this.app.use(express.static(path.join(__dirname, '../uploads')));
		this.app.use(serveFavicon(path.join(__dirname, '../public/favicon.ico')));
		this.app.use(helmet());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
	}
	private initializeRoutes(routers: IRoute[]) {
		routers.forEach((route) => this.app.use(route.path, route.routes));
		this.app.get('/', (req, res, next) => {
			return res.status(200).send('Hello World!');
		});
	}
	private initializeErrorHandling() {
		this.app.use(handleNotFoundPage);
		this.app.use(handlerError);
	}
}
