import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/loading/Loading';
import { useHistory, useParams } from 'react-router-dom';
import { url } from '../../../const';

const initialState = {
	ID: '',
	title: 'title',
	price: 0,
	description: 'description',
	content: 'content',
	category: '',
};

function CreateProduct() {
	const state = useContext(GlobalState);
	const [product, setProduct] = useState(initialState);
	const [categories] = state.categoriesAPI.categories;
	const [images, setImages] = useState(false);
	const [loading, setLoading] = useState(false);

	const [isAdmin] = state.userAPI.isAdmin;
	const [token] = state.token;

	const history = useHistory();
	const param = useParams();

	const [products] = state.productsAPI.products;
	const [onEdit, setOnEdit] = useState(false);
	const [callback, setCallback] = state.productsAPI.callback;

	useEffect(() => {
		if (param.id) {
			setOnEdit(true);
			products.forEach((product) => {
				if (product._id === param.id) {
					setProduct(product);
					setImages(product.images);
				}
			});
		} else {
			setOnEdit(false);
			setProduct(initialState);
			setImages(false);
		}
	}, [param.id, products]);

	const handleUpload = async (e) => {
		e.preventDefault();
		try {
			if (!isAdmin) return alert("You're not an admin");
			const file = e.target.files[0];

			if (!file) return alert('File not exist.');

			if (file.size > 1024 * 1024)
				// 1mb
				return alert('Size too large!');

			if (file.type !== 'image/jpeg' && file.type !== 'image/png')
				// 1mb
				return alert('File format is incorrect.');

			let formData = new FormData();
			formData.append('file', file);

			setLoading(true);
			const res = await axios.post(`${url}/product/upload`, formData, {
				headers: { 'content-type': 'multipart/form-data', Authorization: token },
			});
			setLoading(false);
			setImages(res.data);
		} catch (err) {
			alert(err.response.data.message);
		}
	};

	const handleDestroy = async () => {
		try {
			if (!isAdmin) return alert("You're not an admin");
			setLoading(true);
			await axios.post(
				`${url}/product/destroy`,
				{ imageId: images._id },
				{
					headers: { Authorization: token },
				}
			);
			setLoading(false);
			setImages(false);
		} catch (err) {
			alert(err.response.data.message);
		}
	};

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setProduct({ ...product, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!isAdmin) return alert("You're not an admin");
			if (!images) return alert('No Image Upload');

			if (onEdit) {
				await axios.put(
					`${url}/product/${product._id}`,
					{ ...product, images: images._id },
					{
						headers: { Authorization: token },
					}
				);
			} else {
				await axios.post(
					`${url}/product`,
					{ ...product, images: images._id },
					{
						headers: { Authorization: token },
					}
				);
			}
			setCallback(!callback);
			history.push('/');
		} catch (err) {
			alert(err.response.data.message);
		}
	};

	const styleUpload = {
		display: images ? 'block' : 'none',
	};
	return (
		<div className="create_product">
			<div className="upload">
				<input type="file" name="file" id="file_up" onChange={handleUpload} />
				{loading ? (
					<div id="file_img">
						<Loading />
					</div>
				) : (
					<div id="file_img" style={styleUpload}>
						<img src={images ? `${url}/${images.path}`.replace('uploads', '') : ''} alt="" />
						<span onClick={handleDestroy}>X</span>
					</div>
				)}
			</div>

			<form onSubmit={handleSubmit}>
				<div className="row">
					<label htmlFor="product_id">Product ID</label>
					<input
						type="text"
						name="ID"
						id="ID"
						required
						value={product.ID}
						onChange={handleChangeInput}
						disabled={onEdit}
					/>
				</div>

				<div className="row">
					<label htmlFor="title">Title</label>
					<input type="text" name="title" id="title" required value={product.title} onChange={handleChangeInput} />
				</div>

				<div className="row">
					<label htmlFor="price">Price</label>
					<input type="number" name="price" id="price" required value={product.price} onChange={handleChangeInput} />
				</div>

				<div className="row">
					<label htmlFor="description">Description</label>
					<textarea
						type="text"
						name="description"
						id="description"
						required
						value={product.description}
						rows="5"
						onChange={handleChangeInput}
					/>
				</div>

				<div className="row">
					<label htmlFor="content">Content</label>
					<textarea
						type="text"
						name="content"
						id="content"
						required
						value={product.content}
						rows="7"
						onChange={handleChangeInput}
					/>
				</div>

				<div className="row">
					<label htmlFor="categories">Categories: </label>
					<select name="category" value={product.category} onChange={handleChangeInput}>
						<option value="">Please select a category</option>
						{categories.map((category) => (
							<option value={category._id} key={category._id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				<button type="submit">{onEdit ? 'Update' : 'Create'}</button>
			</form>
		</div>
	);
}

export default CreateProduct;
