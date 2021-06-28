import path from 'path';
import { v4 } from 'uuid';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { multerConst } from './upload.const';
import { HttpException } from '../exception';

export class MulterConfig {
	private fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
		try {
			const mime = multerConst.fileMime.includes(file.mimetype);
			const ext = multerConst.fileExt.includes(path.extname(file.originalname));
			if (mime && ext) return cb(null, true);
			return cb(new HttpException(415, 'Only images are allowed'));
		} catch (error) {
			return cb(error, false);
		}
	}
	private storage = multer.diskStorage({
		destination(req: Request, file: Express.Multer.File, cb: any): string | void {
			try {
				const dir = './uploads/products/';
				fs.mkdirSync(dir, { recursive: true });
				return cb(null, dir);
			} catch (error) {
				return cb(error, null);
			}
		},
		filename(req: Request, file: Express.Multer.File, cb: any): void {
			cb(null, v4() + '_' + file.originalname);
		},
	});
	public upload = multer({
		storage: this.storage,
		fileFilter: this.fileFilter,
		limits: { fileSize: multerConst.maxSize },
	});
}
