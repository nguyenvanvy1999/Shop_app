import { parse } from 'dotenv';
import fs from 'fs';
import { IConfig } from './interfaces';
import joi from 'joi';
import { logger } from '../logger';
import path from 'path';

class ConfigService {
	private readonly envConfig: IConfig;
	constructor(filePath: string) {
		const config = parse(fs.readFileSync(filePath));
		this.envConfig = ConfigService.validateInput(config);
	}

	private static validateInput(config: IConfig): IConfig {
		const schema = joi
			.object({
				NODE_ENV: joi.string().valid('dev', 'prod').default('dev'),
				DEBUG: joi.boolean().default(false),
				PORT: joi.number().default(8080),
				URL: joi
					.string()
					.uri({ scheme: [/https?/] })
					.required(),
				MONGO_URI: joi
					.string()
					.regex(/^mongodb/)
					.default('mongodb://localhost:27017/Shop'),
				SALT: joi.number().min(4).max(15).default(5),
				MASTER_PASSWORD: joi.string().required(),
				SECRET: joi.string().min(5).required(),
			})
			.unknown(true);
		const { error, value: validatedConfig } = schema.validate(config);
		if (error) {
			logger.error(error.message);
			throw new Error(`Config validate failed, error : ${error.message}`);
		}
		return validatedConfig;
	}

	public get(key: string): string {
		return this.envConfig[key.toUpperCase()];
	}

	get host(): string {
		return this.get('host');
	}

	get port(): number {
		return parseInt(this.get('port'));
	}

	get env(): string {
		return this.get('node_env');
	}
	get isDebug(): boolean {
		return this.get('debug') === 'true';
	}

	get salt(): number {
		return parseInt(this.get('salt'));
	}
	get secret(): string {
		return this.get('secret');
	}
	get rootPath(): string {
		return this.get('root_path');
	}
}

export const config = new ConfigService('.env');
