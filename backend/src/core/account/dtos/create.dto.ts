import { IAccount } from '../interfaces';

export type Tmp = Pick<IAccount, 'username' | 'password' | 'fullName'>;

export interface AccountCreateDTO extends Tmp {
	masterPassword?: string;
}
