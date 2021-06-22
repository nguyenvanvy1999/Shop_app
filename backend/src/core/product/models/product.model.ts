import { Model, model, Schema, Types } from 'mongoose';
import { schemaOption } from '../../base/constants';
import { IProduct } from '../interfaces';

interface IProductModel extends Model<IProduct> {}
const ProductSchema: Schema = new Schema(
	{
		_id: Types.ObjectId,
		ID: { type: String, require: true, default: '', unique: true },
		title: { type: String, require: true, default: '' },
		category: { type: Types.ObjectId, ref: 'Category' },
		price: { type: Number, require: true, default: 0 },
		description: { type: String, require: true, default: '' },
		content: { type: String, default: '' },
		image: { type: Types.ObjectId, ref: 'Image' },
		slide: { type: [{ type: Types.ObjectId, ref: 'Image' }] },
		createdBy: { type: Types.ObjectId, ref: 'Account', default: null },
		updatedBy: { type: Types.ObjectId, ref: 'Account', default: null },
	},
	schemaOption
);

export const Product: IProductModel = model<IProduct, IProductModel>('Product', ProductSchema);
