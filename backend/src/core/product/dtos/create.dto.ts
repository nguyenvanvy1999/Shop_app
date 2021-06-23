import { IProduct } from '../interfaces';

type Tmp = Pick<IProduct, 'title' | 'ID' | 'category' | 'price' | 'description' | 'slide'>;

export interface ProductCreateDTO extends Tmp {
	userId: string;
}
