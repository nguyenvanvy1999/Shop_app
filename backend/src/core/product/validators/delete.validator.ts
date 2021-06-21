import { celebrate, Joi, Segments } from 'celebrate';
import { joiOID } from '../../../common/validators';

export const ProductDeleteVAL = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: joiOID.objectId().required(),
	}),
});
