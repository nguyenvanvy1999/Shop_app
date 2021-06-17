import { Account } from '../models';
import { IAccount } from '../interfaces';
import { Types } from 'mongoose';
import { AccountCreateDTO, AccountUpdateDTO } from '../dtos';
import { hashPassword } from '../tools';

export class AccountService {
	public async create(account: AccountCreateDTO, admin?: boolean): Promise<IAccount> {
		try {
			const newAccount = new Account({
				_id: Types.ObjectId(),
				...account,
				password: hashPassword(account.password),
				role: admin ? 1 : 0,
			});
			await newAccount.save();
			return newAccount;
		} catch (error) {
			throw error;
		}
	}
	public async findById(id: string): Promise<IAccount> {
		try {
			return await Account.findById(id);
		} catch (error) {
			throw error;
		}
	}
	public async findAll(): Promise<IAccount[]> {
		try {
			return await Account.find();
		} catch (error) {
			throw error;
		}
	}
	public async findByUsername(username: string): Promise<IAccount> {
		try {
			return await Account.findOne({ username });
		} catch (error) {
			throw error;
		}
	}
	public async edit(_id: string, update: AccountUpdateDTO): Promise<IAccount> {
		try {
			return await Account.findOneAndUpdate({ _id }, { ...update }, { new: true });
		} catch (error) {
			throw error;
		}
	}
	public async editPassword(_id: string, password: string): Promise<IAccount> {
		try {
			return await Account.findOneAndUpdate({ _id }, { password: hashPassword(password) }, { new: true });
		} catch (error) {
			throw error;
		}
	}
}
