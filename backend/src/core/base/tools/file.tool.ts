import fs from 'fs';
import { config } from '../../../common/config';

export const removeFilesByPaths = (paths: string[] | string): void => {
	Array.isArray(paths) ? paths.forEach((path) => fs.unlinkSync(path)) : fs.unlinkSync(paths);
};

export const removeFilesError = (files: any): void => files.forEach((file) => fs.unlinkSync(`${config.rootPath}`));
