import { celebrate, Joi, Segments } from 'celebrate';

export const SignInVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
});
