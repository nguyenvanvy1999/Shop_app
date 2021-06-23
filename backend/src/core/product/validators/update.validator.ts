import { celebrate, Joi, Segments } from 'celebrate';
import { joiOID } from '../../../common/validators';

export const ProductUpdateVAL = celebrate({
	[Segments.BODY]: Joi.object()
		.keys({
			title: Joi.string(),
			ID: Joi.string(),
			category: Joi.string(),
			price: Joi.number().min(0),
			description: Joi.string(),
			content: Joi.string(),
			slide: Joi.array().items(Joi.any()),
		})
		.unknown(true),
	[Segments.PARAMS]: Joi.object().keys({
		id: joiOID.objectId().required(),
	}),
});
