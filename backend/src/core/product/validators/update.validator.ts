import { celebrate, Joi, Segments } from 'celebrate';
import { joiOID } from '../../../common/validators';
import { ProductCategory, ProductType } from '../interfaces';

export const ProductUpdateVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		productId: joiOID.objectId().required(),
		name: Joi.string(),
		ID: Joi.string(),
		category: Joi.string().allow(Object.values(ProductCategory).filter((x) => typeof x === 'string')),
		type: Joi.string().allow(Object.values(ProductType).filter((x) => typeof x === 'string')),
		price: Joi.number().min(0),
		description: Joi.string(),
		deleteThumbnail: Joi.string().allow('true', 'false'),
	}),
});
