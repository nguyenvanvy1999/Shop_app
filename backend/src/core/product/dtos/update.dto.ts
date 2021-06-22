import { IProduct } from '../interfaces';

type Tmp = Pick<IProduct, 'title' | 'ID' | 'category' | 'price' | 'description' | 'content' | 'image'>;

export interface ProductUpdateDTO extends Tmp {
	userId: string;
	productId: string;
}
