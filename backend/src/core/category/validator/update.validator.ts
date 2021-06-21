import { celebrate, Segments, Joi } from 'celebrate';
import { joiOID } from '../../../common/validators';

export const CategoryUpdateVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().required(),
	}),
	[Segments.PARAMS]: Joi.object().keys({
		id: joiOID.objectId().required(),
	}),
});
