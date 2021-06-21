import { IProduct } from '../interfaces';

type Tmp = Pick<IProduct, 'title' | 'ID' | 'category' | 'price' | 'description' | 'image'>;

export interface ProductCreateDTO extends Tmp {
	userId: string;
}
