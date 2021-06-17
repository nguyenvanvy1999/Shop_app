import { model, Model, Schema, Types } from 'mongoose';
import { schemaOption } from '../../base/constants';
import { IRefreshToken } from '../interfaces';

export interface IRefreshTokenModel extends Model<IRefreshToken> {}
export const RefreshTokenSchema: Schema = new Schema(
	{
		_id: Types.ObjectId,
		accountId: { type: Types.ObjectId, require: true },
		token: { type: String, require: true, unique: true },
		expiresIn: { type: String, require: true },
	},
	schemaOption
);

export const RefreshToken: IRefreshTokenModel = model<IRefreshToken, IRefreshTokenModel>(
	'RefreshToken',
	RefreshTokenSchema
);
