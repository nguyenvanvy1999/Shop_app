import fs from 'fs';

export const removeFilesByPath = (paths: string[]) => paths.forEach((path) => fs.unlinkSync(path));
