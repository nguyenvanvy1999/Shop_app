import { IProduct } from '../interfaces';

type Tmp = Pick<IProduct, 'name' | 'ID' | 'category' | 'type' | 'price' | 'description'>;

export interface ProductUpdateDTO extends Tmp {
	userId: string;
	productId: string;
	thumbnailId?: string;
	deleteThumbnail?: string;
}
