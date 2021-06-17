import { model, Model, Schema, Types } from 'mongoose';
import { schemaOption } from '../../base/constants';
import { ICategory } from '../interfaces';

export interface ICategoryModel extends Model<ICategory> {}

const CategorySchema: Schema = new Schema(
	{
		_id: Types.ObjectId,
		name: { type: String, unique: true, default: '' },
	},
	schemaOption
);

export const Category: ICategoryModel = model<ICategory, ICategoryModel>('Category', CategorySchema);
