import { celebrate, Segments, Joi } from 'celebrate';
import { joiOID } from '../../../common/validators';

export const CategoryDeleteVAL = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: joiOID.objectId().required(),
	}),
});
