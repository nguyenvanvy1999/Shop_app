import { IProduct } from '../interfaces';

type Tmp = Pick<IProduct, 'title' | 'ID' | 'category' | 'price' | 'description' | 'content' | 'slide'>;

export interface ProductUpdateDTO extends Tmp {
	userId: string;
	productId: string;
}
