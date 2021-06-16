import { celebrate, Segments, Joi } from 'celebrate';
import { JoiPasswordComplexity } from '../../../common/validators';

export const UpdatePasswordVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		newPassword: JoiPasswordComplexity.string()
			.min(2)
			.max(20)
			.minOfSpecialCharacters(1)
			.minOfLowercase(1)
			.minOfUppercase(1)
			.minOfNumeric(1)
			.required(),
		confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
	}),
});
