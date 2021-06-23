import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { url } from '../../../const';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import SlideShow from '../utils/slideShow/slideShow';

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
	const paths = detailProduct.slide.map((a) => `${url}/${a.path}`.replace('uploads', ''));
	return (
		<>
			<div className="detail">
				<img src={`${url}/${detailProduct.slide[0].path}`.replace('uploads', '')} alt="" />
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
				<h2>Images of product</h2>
				<div>
					<SlideShow images={paths} />
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
			</div>
		</>
	);
}

export default DetailProduct;
