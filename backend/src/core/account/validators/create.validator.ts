import { celebrate, Joi, Segments } from 'celebrate';
import { JoiPasswordComplexity } from '../../../common/validators';

export const AccountCreateVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		username: Joi.string().min(2).max(20).required(),
		password: JoiPasswordComplexity.string()
			.min(2)
			.max(20)
			.minOfSpecialCharacters(1)
			.minOfLowercase(1)
			.minOfUppercase(1)
			.minOfNumeric(1)
			.required(),
		confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
		masterPassword: Joi.string().required(),
		fullName: Joi.string().required(),
	}),
});
