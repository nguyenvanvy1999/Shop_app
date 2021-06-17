import { Types } from 'mongoose';
import { ICategory } from '../interfaces';
import { Category } from '../models';

export class CategoryService {
	public async create(name: string): Promise<ICategory> {
		try {
			const newCategory = new Category({ _id: Types.ObjectId(), name });
			await newCategory.save();
			return newCategory;
		} catch (error) {
			throw error;
		}
	}
	public async findAll(): Promise<ICategory[]> {
		try {
			return await Category.find().lean();
		} catch (error) {
			throw error;
		}
	}
	public async findByName(name: string): Promise<ICategory> {
		try {
			return await Category.findOne({ name });
		} catch (error) {
			throw error;
		}
	}
	public async deleteOne(_id: string): Promise<ICategory> {
		try {
			return await Category.findOneAndDelete({ _id });
		} catch (error) {
			throw error;
		}
	}
	public async updateOne(_id: string, name: string): Promise<ICategory> {
		try {
			return await Category.findOneAndUpdate({ _id }, { name }, { new: true });
		} catch (error) {
			throw error;
		}
	}
}
