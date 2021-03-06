import React from 'react';
import { url } from '../../../../const';
import BtnRender from './BtnRender';

function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {
	return (
		<div className="product_card">
			{isAdmin && <input type="checkbox" checked={product.checked} onChange={() => handleCheck(product._id)} />}
			<img
				src={product?.slide[0]?.path ? `${url}/${product.slide[0].path}`.replace('uploads', '') : undefined}
				alt=""
			/>
			<div className="product_box">
				<h2 title={product.title}>{product.title}</h2>
				<span>${product.price}</span>
				<p>{product.description}</p>
			</div>
			<BtnRender product={product} deleteProduct={deleteProduct} />
		</div>
	);
}

export default ProductItem;
