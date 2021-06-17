import { Document } from 'mongoose';
import { IBase } from '../../base/interfaces';

export interface IAccount extends IBase, Document {
	_id: string;
	username: string;
	password: string;
	fullName: string;
	role: number;
}
