import { Types } from 'mongoose';
import path from 'path';
import { removeFilesByPaths } from '../../base/tools';
import { ImageCreateDTO } from '../dtos';
import { IImage } from '../interfaces/image.interface';
import { Image } from '../models';

export class ImageService {
	public async findById(id: string): Promise<IImage> {
		try {
			return await Image.findById(id);
		} catch (error) {
			throw error;
		}
	}
	public async create(image: ImageCreateDTO): Promise<IImage> {
		try {
			const newImage = new Image({
				_id: Types.ObjectId(),
				...image,
			});
			await newImage.save();
			return newImage;
		} catch (error) {
			throw error;
		}
	}
	public async deleteMany(imageIds: string[]): Promise<any> {
		try {
			const images = await Image.find({ _id: { $in: imageIds } });
			let dirs: string[] = [];
			images.forEach((image) => dirs.push(image.path));
			dirs.map((dir) => path.join(__dirname, '../../../../', dir));
			removeFilesByPaths(dirs);
			return await Image.deleteMany({ _id: { $in: imageIds } });
		} catch (error) {
			throw error;
		}
	}
	public async deleteById(_id: string): Promise<IImage> {
		try {
			const image = await Image.findById(_id);
			const dir = path.join(__dirname, '../../../../', image.path);
			removeFilesByPaths(dir);
			return await Image.findOneAndDelete({ _id });
		} catch (error) {
			throw error;
		}
	}
}
