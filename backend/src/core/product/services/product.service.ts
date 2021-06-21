import { Types } from 'mongoose';
import { EditImageDTO, ProductCreateDTO, ProductUpdateDTO } from '../dtos';
import { IProduct } from '../interfaces';
import { Product } from '../models';

export class ProductService {
	public async create(product: ProductCreateDTO): Promise<IProduct> {
		try {
			const newProduct = new Product({
				_id: Types.ObjectId(),
				...product,
				createdBy: product.userId,
				updatedBy: product.userId,
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
			return await Product.find().populate('images').exec();
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
	public async editProduct(_id: string, update: ProductUpdateDTO): Promise<IProduct> {
		try {
			return await Product.findOneAndUpdate({ _id }, { ...update, updatedBy: update.userId }, { new: true });
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
	public async deleteProduct(_id: string): Promise<IProduct> {
		try {
			return await Product.findOneAndDelete({ _id });
		} catch (error) {
			throw error;
		}
	}
	public async checkProduct(category: string): Promise<boolean> {
		try {
			const product = await Product.findOne({ category });
			return product ? true : false;
		} catch (error) {
			throw error;
		}
	}
}
