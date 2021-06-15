import { Types } from 'mongoose';
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
			return await Image.deleteMany({ _id: { $in: imageIds } });
		} catch (error) {
			throw error;
		}
	}
	public async getPaths(imageIds: string[]): Promise<string[]> {
		try {
			const images = await Image.find({ _id: { $in: imageIds } });
			let result: string[] = [];
			images.forEach((image) => result.push(image.path));
			return result;
		} catch (error) {
			throw error;
		}
	}
}
