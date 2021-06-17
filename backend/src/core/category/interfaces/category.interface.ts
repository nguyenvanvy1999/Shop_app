import { Document } from 'mongoose';
import { IBase } from '../../base/interfaces';

export interface ICategory extends IBase, Document {
	name: string;
}
