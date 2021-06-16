import { ProductCategory, ProductType } from '../interfaces';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../../common/exception/http-error';
import { productService } from '../services';
import { EditImageDTO, ProductCreateDTO, ProductUpdateDTO } from '../dtos';
import { RequestWithUser } from '../../base/interfaces';
import { uploadMany, uploadOne } from '../../../common/upload';
import { IImage } from '../../image/interfaces/image.interface';
import { imageService } from '../../image/services';

export class ProductController {
	public async create(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			await uploadOne(req, res);
			let image: IImage;
			if (req.file) {
				image = await imageService.create({ name: req.file.filename, path: req.file.path });
			}
			const product: ProductCreateDTO = req.body;
			const newProduct = await productService.create(product, req.user._id, image ? image._id : undefined);
			return res.status(200).send({ newProduct });
		} catch (error) {
			next(error);
		}
	}
	public async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const products = await productService.findAll();
			return res.status(200).send({ products });
		} catch (error) {
			next(error);
		}
	}
	public async findById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const product = await productService.findById(id);
			return res.status(200).send({ product });
		} catch (error) {
			next(error);
		}
	}
	public async findByType(req: Request, res: Response, next: NextFunction) {
		try {
			const { type } = req.params;
			if (!Object.values(ProductType).includes(type)) throw new HttpException(400, 'Type wrong!');
			const products = await productService.findByType(ProductType[type]);
			return res.status(200).send({ products });
		} catch (error) {
			next(error);
		}
	}
	public async findByCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const { category } = req.params;
			if (!Object.values(ProductCategory).includes(category)) throw new HttpException(400, 'Category wrong!');
			const product = await productService.findByCategory(category);
			return res.status(200).send({ product });
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
			const { productId } = req.body;
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
			// user can changer thumbnail image or delete old thumbnail or no changer
			await uploadOne(req, res);
			let update: ProductUpdateDTO = { ...req.body };
			const product = await productService.findById(update.productId);
			if (!product) throw new HttpException(400, 'ProductID wrong!');
			if (req.file) {
				await imageService.deleteById(product.thumbnailId);
				const { filename: name, path } = req.file;
				const image = await imageService.create({ name, path });
				update.thumbnailId = image._id;
			} else if (update.deleteThumbnail === 'true') update.thumbnailId = null;
			const newProduct = await productService.editProduct(update.productId, update);
			return res.status(200).send(newProduct);
		} catch (error) {
			next(error);
		}
	}
}
