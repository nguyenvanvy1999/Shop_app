import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../../common/exception/http-error';
import { productService } from '../services';
import { EditImageDTO, ProductCreateDTO, ProductUpdateDTO } from '../dtos';
import { RequestWithUser } from '../../base/interfaces';
import { uploadMany } from '../../../common/upload';
import { imageService } from '../../image/services';
import { removeFilesError } from '../../base/tools';

export class ProductController {
	public async create(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			let product: ProductCreateDTO = req.body;
			product.userId = req.user._id;
			const newProduct = await productService.create(product);
			return res.status(200).send({ newProduct });
		} catch (error) {
			next(error);
		}
	}
	public async addImage(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			await uploadMany(req, res);
			const files: any = req.files;
			if (files.length === 0) throw new HttpException(400, 'No file found!');
			let imageIds: string[] = [];
			for (const file of files) {
				const { filename: name, path } = file;
				const image = await imageService.create({ name, path });
				imageIds.push(image._id);
			}
			const product = await productService.pushImage({ productId: req.body.productId, imageIds });
			return res.status(200).send(product);
		} catch (error) {
			next(error);
		}
	}
	public async removeImage(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const data: EditImageDTO = req.body;
			await imageService.deleteMany(data.imageIds);
			const product = await productService.pullImage(data);
			return res.status(200).send(product);
		} catch (error) {
			next(error);
		}
	}
	public async deleteProduct(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const { productId } = req.params;
			const product = await productService.findById(productId);
			if (!product) throw new HttpException(400, 'ProductID wrong!');
			await imageService.deleteMany(product.images);
			await productService.deleteProduct(productId);
			return res.status(200).send('Delete successfully!');
		} catch (error) {
			next(error);
		}
	}
	public async editProduct(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			let update: ProductUpdateDTO = { ...req.body };
			update.userId = req.user._id;
			const product = await productService.findById(update.productId);
			if (!product) throw new HttpException(400, 'ProductID wrong!');
			const newProduct = await productService.editProduct(update.productId, update);
			return res.status(200).send(newProduct);
		} catch (error) {
			next(error);
		}
	}
	public async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const products = await productService.findAll();
			return res.status(200).json({
				status: 'success',
				result: products.length,
				products: products,
			});
		} catch (error) {
			next(error);
		}
	}
	public async upload(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			await uploadMany(req, res);
			const files: any = req.files;
			if (files.length === 0) throw new HttpException(400, 'No file found!');
			let imageIds: string[] = [];
			for (const file of files) {
				const { filename: name, path } = file;
				const image = await imageService.create({ name, path });
				imageIds.push(image._id);
			}
			return res.status(200).json({ images: imageIds });
		} catch (error) {
			removeFilesError(req.files);
			next(error);
		}
	}
}
