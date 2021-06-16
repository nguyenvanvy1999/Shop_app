import { celebrate, Joi, Segments } from 'celebrate';
import { joiOID } from '../../../common/validators';

export const RemoveImagesVAL = celebrate({
	[Segments.BODY]: Joi.object().keys({
		productId: joiOID.objectId().required(),
		imageIds: Joi.array().items(joiOID.objectId()).min(1).required(),
	}),
});
