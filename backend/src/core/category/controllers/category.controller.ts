import { NextFunction, Response, Request } from 'express';
import { HttpException } from '../../../common/exception';
import { productService } from '../../product/services';
import { categoryService } from '../services';

export class CategoryController {
	public async get(req: Request, res: Response, next: NextFunction) {
		try {
			const categories = await categoryService.findAll();
			return res.status(200).json(categories);
		} catch (error) {
			next(error);
		}
	}
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { name } = req.body;
			const isExits = await categoryService.findByName(name);
			if (isExits) throw new HttpException(400, 'Category has been exits!');
			await categoryService.create(name);
			return res.status(200).json({ message: 'Create successfully!' });
		} catch (error) {
			next(error);
		}
	}
	public async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const isEmpty = await productService.checkProduct(req.params.id);
			if (isEmpty) throw new HttpException(400, 'Please delete all products with a relationship.');
			await categoryService.deleteOne(req.params.id);
			return res.status(200).json({ message: 'Deleted successfully!' });
		} catch (error) {
			next(error);
		}
	}
	public async updateCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const { name } = req.body;
			await categoryService.updateOne(req.params.id, name);
			return res.json({ message: 'Updated successfully!' });
		} catch (error) {
			next(error);
		}
	}
}
