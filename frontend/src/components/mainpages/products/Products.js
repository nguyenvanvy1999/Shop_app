import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import Loading from '../utils/loading/Loading';
import axios from 'axios';
import Filters from './Filters';
import LoadMore from './LoadMore';
import { url } from '../../../const';

function Products() {
	const state = useContext(GlobalState);
	const [products, setProducts] = state.productsAPI.products;
	const [isAdmin] = state.userAPI.isAdmin;
	const [callback, setCallback] = state.productsAPI.callback;
	const [loading, setLoading] = useState(false);
	const [isCheck, setIsCheck] = useState(false);

	const handleCheck = (id) => {
		products.forEach((product) => {
			if (product._id === id) product.checked = !product.checked;
		});
		setProducts([...products]);
	};

	const deleteProduct = async (id) => {
		const token = localStorage.getItem('accessToken');
		try {
			setLoading(true);
			const deleteProduct = axios.delete(`${url}/product/${id}`, {
				headers: { Authorization: token },
			});
			await deleteProduct;
			setCallback(!callback);
			setLoading(false);
		} catch (err) {
			alert(err.response.data.msg);
		}
	};

	const checkAll = () => {
		products.forEach((product) => {
			product.checked = !isCheck;
		});
		setProducts([...products]);
		setIsCheck(!isCheck);
	};

	const deleteAll = () => {
		products.forEach((product) => {
			if (product.checked) deleteProduct(product._id);
		});
	};

	if (loading)
		return (
			<div>
				<Loading />
			</div>
		);
	return (
		<>
			<Filters />
			{isAdmin && (
				<div className="delete-all">
					<span>Select all</span>
					<input type="checkbox" checked={isCheck} onChange={checkAll} />
					<button onClick={deleteAll}>Delete ALL</button>
				</div>
			)}
			<div className="products">
				{products.map((product) => {
					return (
						<ProductItem
							key={product._id}
							product={product}
							isAdmin={isAdmin}
							deleteProduct={deleteProduct}
							handleCheck={handleCheck}
						/>
					);
				})}
			</div>
			<LoadMore />
			{products.length === 0 && <Loading />}
		</>
	);
}

export default Products;
