import { IProduct } from '../interfaces';

type Tmp = Pick<IProduct, 'name' | 'ID' | 'category' | 'type' | 'price' | 'description'>;

export interface ProductCreateDTO extends Tmp {
	userId: string;
	thumbnailId?: string;
}
