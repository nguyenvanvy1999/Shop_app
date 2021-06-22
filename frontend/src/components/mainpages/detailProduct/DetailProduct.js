import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { url } from '../../../const';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import SlideShow from '../slideShow/slideShow';

const slideImages = [
	'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80',
	'https://images.unsplash.com/photo-1470341223622-1019832be824?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2288&q=80',
	'https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2094&q=80',
	'https://images.unsplash.com/photo-1534161308652-fdfcf10f62c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2174&q=80',
];
function DetailProduct() {
	const params = useParams();
	const state = useContext(GlobalState);
	const [products] = state.productsAPI.products;
	const [detailProduct, setDetailProduct] = useState([]);

	useEffect(() => {
		if (params.id) {
			products.forEach((product) => {
				if (product._id === params.id) setDetailProduct(product);
			});
		}
	}, [params.id, products]);

	if (detailProduct.length === 0) return null;

	return (
		<>
			<div className="detail">
				<img src={`${url}/${detailProduct.image.path}`.replace('uploads', '')} alt="" />
				<div className="box-detail">
					<div className="row">
						<h2>{detailProduct.title}</h2>
						<h6>ID:{detailProduct.ID}</h6>
					</div>
					<span>$ {detailProduct.price}</span>
					<p>{detailProduct.description}</p>
					<p>{detailProduct.content}</p>
				</div>
			</div>

			<div>
				<h2>Related products</h2>
				<div className="products">
					{products.map((product) => {
						return product.category === detailProduct.category ? (
							<ProductItem key={product._id} product={product} />
						) : null;
					})}
				</div>
				<h2>Images of product</h2>
				<div>
					<SlideShow images={slideImages} />
				</div>
			</div>
		</>
	);
}

export default DetailProduct;
