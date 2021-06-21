import { celebrate, Segments, Joi } from 'celebrate';

export const CategoryCreateVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().required(),
	}),
});
