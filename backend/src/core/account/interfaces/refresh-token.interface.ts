import { Document } from 'mongoose';
import { IBase } from '../../base/interfaces';

export interface IRefreshToken extends IBase, Document {
	_id: string;
	accountId: string;
	token: string;
	expiresIn: Date;
}
