import { model, Model, Schema, Types } from 'mongoose';
import { schemaOption } from '../../base/constants';
import { IAccount } from '../interfaces';

export interface IAccountModel extends Model<IAccount> {}
export const AccountSchema: Schema = new Schema(
	{
		_id: Types.ObjectId,
		username: { type: String, require: true, unique: true, minLength: 5, maxLength: 30, immutable: true },
		fullName: { type: String, default: '' },
		role: { type: Number, default: 0 },
		password: { type: String, require: true, minLength: 5 },
	},
	schemaOption
);

export const Account: IAccountModel = model<IAccount, IAccountModel>('Account', AccountSchema);
