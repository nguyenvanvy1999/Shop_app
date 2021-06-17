import { celebrate, Joi, Segments } from 'celebrate';
import { joiOID } from '../../../common/validators';

export const ProductUpdateVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		productId: joiOID.objectId().required(),
		name: Joi.string(),
		ID: Joi.string(),
		category: Joi.string(),
		price: Joi.number().min(0),
		description: Joi.string(),
		deleteThumbnail: Joi.string().allow('true', 'false'),
	}),
});
