import { IProduct } from '../interfaces';

type Tmp = Pick<IProduct, 'name' | 'ID' | 'category' | 'price' | 'description' | 'images'>;

export interface ProductCreateDTO extends Tmp {
	userId: string;
}
