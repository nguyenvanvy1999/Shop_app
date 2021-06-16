import { celebrate, Joi, Segments } from 'celebrate';
import { ProductCategory, ProductType } from '../interfaces';

export const ProductCreateVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().required(),
		ID: Joi.string().required(),
		category: Joi.string().allow(Object.values(ProductCategory)).required(),
		type: Joi.string().allow(Object.values(ProductType)).required(),
		price: Joi.number().min(0).required(),
		description: Joi.string().required(),
	}),
});
