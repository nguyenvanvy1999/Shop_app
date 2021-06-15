import fs from 'fs';

export const removeFilesByPaths = (paths: string[] | string): void => {
	Array.isArray(paths) ? paths.forEach((path) => fs.unlinkSync(path)) : fs.unlinkSync(paths);
};
