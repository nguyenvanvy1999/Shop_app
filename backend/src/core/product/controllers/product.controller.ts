import { Response, NextFunction } from 'express';
import { HttpException } from '../../../common/exception/http-error';
import { productService } from '../services';
import { ProductCreateDTO, ProductUpdateDTO } from '../dtos';
import { RequestWithUser } from '../../base/interfaces';
import { uploadMany, uploadOne } from '../../../common/upload';
import { imageService } from '../../image/services';
import { removeFilesError } from '../../base/tools';
import { Product } from '../models';
import { IImage } from '../../image/interfaces/image.interface';

class APIQuery {
	constructor(public query: any, public queryString: any) {}
	filtering() {
		const queryObj = { ...this.queryString }; //queryString = req.query
		const excludedFields = ['page', 'sort', 'limit'];
		excludedFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => '$' + match);
		//    gte = greater than or equal
		//    lte = lesser than or equal
		//    lt = lesser than
		//    gt = greater than
		this.query.find(JSON.parse(queryStr));
		return this;
	}

	sorting() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	paginating() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 9;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}
export class ProductController {
	public async create(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const files: any = req.files;
			let product: ProductCreateDTO = req.body;
			product.userId = req.user._id;
			let imageIds = [];
			await Promise.all(
				files.map(async (file) => {
					const image = await imageService.create({ name: file.filename, path: file.path });
					imageIds.push(image._id);
				})
			);
			product.slide = imageIds;
			const newProduct = await productService.create(product);
			return res.status(200).send({ newProduct });
		} catch (error) {
			next(error);
		}
	}
	public async deleteProduct(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const product = await productService.findById(id);
			if (!product) throw new HttpException(400, 'ProductID wrong!');
			await imageService.deleteMany(product.slide);
			await productService.deleteProduct(id);
			return res.status(200).send('Delete successfully!');
		} catch (error) {
			await productService.deleteProduct(req.params.id);
			return res.status(200).send('Delete successfully!');
		}
	}
	public async editProduct(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			let productId = req.params.id;
			let update: ProductUpdateDTO = { ...req.body };
			update.userId = req.user._id;
			const product = await productService.findById(productId);
			if (!product) throw new HttpException(400, 'ProductID wrong!');
			const files: any = req.files;
			if (files.length !== 0) {
				let imageIds = [];
				await Promise.all(
					files.map(async (file) => {
						const image = await imageService.create({ name: file.filename, path: file.path });
						imageIds.push(image._id);
					})
				);
				await imageService.deleteMany(product.slide);
				update.slide = imageIds;
			}
			const newProduct = await productService.editProduct(productId, update);
			return res.status(200).send(newProduct);
		} catch (error) {
			next(error);
		}
	}
	public async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const features = new APIQuery(Product.find().populate('image').populate('slide'), req.query)
				.filtering()
				.sorting()
				.paginating();
			const products = await features.query;
			return res.status(200).json({
				status: 'success',
				result: products.length,
				products,
			});
		} catch (error) {
			next(error);
		}
	}
}
