import { celebrate, Segments, Joi } from 'celebrate';

export const AccountUpdateVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		fullName: Joi.string().required(),
		deleteAvatar: Joi.string().allow('true', 'false'),
	}),
});
