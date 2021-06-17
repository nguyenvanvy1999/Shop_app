import { Types } from 'mongoose';
import { IRefreshToken } from '../interfaces';
import { RefreshToken } from '../models';
import { v4 } from 'uuid';

export class RefreshTokenService {
	public async createToken(userId: string): Promise<IRefreshToken> {
		try {
			const newToken = new RefreshToken({
				_id: Types.ObjectId(),
				token: v4(),
				userId,
				expiresIn: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), //30 days
			});
			await newToken.save();
			return newToken;
		} catch (error) {
			throw error;
		}
	}
	public async findToken(token: string): Promise<IRefreshToken> {
		try {
			return await RefreshToken.findOne({ token });
		} catch (error) {
			throw error;
		}
	}
	public async deleteToken(token: string): Promise<IRefreshToken> {
		try {
			return await RefreshToken.findOneAndDelete({ token });
		} catch (error) {
			throw error;
		}
	}
	public async deleteTokenAccount(accountId: string): Promise<any> {
		try {
			return await RefreshToken.deleteMany({ accountId });
		} catch (error) {
			throw error;
		}
	}
}
