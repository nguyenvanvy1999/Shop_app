import { config } from '../../../common/config';
import { comparePassword } from './bcrypt.tool';

export const isMaster = (password: string): boolean => {
	return comparePassword(password, config.get('master_password'));
};
