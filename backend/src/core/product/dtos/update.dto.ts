import { IProduct } from '../interfaces';

type Tmp = Pick<IProduct, 'name' | 'ID' | 'category' | 'type' | 'price' | 'description'>;

export interface ProductUpdateDTO extends Tmp {
	productId: string;
	thumbnailId?: string;
	deleteThumbnail?: string;
}
