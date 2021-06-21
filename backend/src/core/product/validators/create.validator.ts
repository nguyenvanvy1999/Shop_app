import { celebrate, Joi, Segments } from 'celebrate';

export const ProductCreateVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		title: Joi.string().required(),
		ID: Joi.string().required(),
		category: Joi.string().required(),
		price: Joi.number().min(0).required(),
		description: Joi.string().required(),
		content: Joi.string().required(),
		image: Joi.any(),
	}),
});
