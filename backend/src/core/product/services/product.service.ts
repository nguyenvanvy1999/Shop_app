import { Types } from 'mongoose';
import { EditImageDTO, ProductCreateDTO, ProductUpdateDTO } from '../dtos';
import { IProduct } from '../interfaces';
import { Product } from '../models';

export class ProductService {
	public async create(product: ProductCreateDTO, userId: string, imageId?: string): Promise<IProduct> {
		try {
			const newProduct = new Product({
				_id: Types.ObjectId(),
				...product,
				thumbnailId: imageId ? imageId : null,
				createdBy: userId,
				updatedBy: userId,
			});
			await newProduct.save();
			return newProduct;
		} catch (error) {
			throw error;
		}
	}
	public async findById(id: string): Promise<IProduct> {
		try {
			return await Product.findById(id);
		} catch (error) {
			throw error;
		}
	}
	public async findAll(): Promise<IProduct[]> {
		try {
			return await Product.find({}).lean();
		} catch (error) {
			throw error;
		}
	}
	public async findByCategory(category: string): Promise<IProduct[]> {
		try {
			return await Product.find({ category }).lean();
		} catch (error) {
			throw error;
		}
	}
	public async findByType(type: string): Promise<IProduct[]> {
		try {
			return await Product.find({ type }).lean();
		} catch (error) {
			throw error;
		}
	}
	public async editProduct(_id: string, update: ProductUpdateDTO): Promise<IProduct> {
		try {
			return await Product.findOneAndUpdate({ _id }, { ...update }, { new: true });
		} catch (error) {
			throw error;
		}
	}
	public async pushImage(edit: EditImageDTO): Promise<IProduct> {
		try {
			return await Product.findOneAndUpdate(
				{ _id: edit.productId },
				{ $push: { images: { $each: edit.imageIds } } },
				{ new: true }
			);
		} catch (error) {
			throw error;
		}
	}
	public async pullImage(edit: EditImageDTO): Promise<IProduct> {
		try {
			return await Product.findOneAndUpdate(
				{ _id: edit.productId },
				{ $pullAll: { images: edit.imageIds } },
				{ new: true }
			);
		} catch (error) {
			throw error;
		}
	}
}
