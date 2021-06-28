import fs from 'fs';
import { config } from '../../../common/config';

export const removeFilesByPaths = (paths: string[] | string): void => {
	try {
		Array.isArray(paths) ? paths.forEach((path) => fs.unlinkSync(path)) : fs.unlinkSync(paths);
	} catch (error) {
		throw error;
	}
};

export const removeFilesError = (files: any): void => {
	try {
		Array.isArray(files)
			? files.forEach((file) => fs.unlinkSync(`${config.rootPath}/${file.path}`))
			: fs.unlinkSync(`${config.rootPath}/${files.path}`);
	} catch (error) {
		throw error;
	}
};
