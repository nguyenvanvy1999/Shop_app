import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { useHistory, useParams } from 'react-router-dom';
import { url } from '../../../const';

function UpdateProduct() {
	const state = useContext(GlobalState);
	const [product, setProduct] = useState({});
	const [categories] = state.categoriesAPI.categories;
	const [image, setImage] = useState(false);

	const [isAdmin] = state.userAPI.isAdmin;
	const [token] = state.token;

	const history = useHistory();
	const param = useParams();

	const [products] = state.productsAPI.products;
	const [callback, setCallback] = state.productsAPI.callback;

	const [selectedFile, setSelectedFile] = useState();
	const [preview, setPreview] = useState();

	useEffect(() => {
		products.forEach((product) => {
			if (product._id === param.id) {
				setProduct(product);
				setImage(product.image);
			}
		});
		if (selectedFile) {
			const objectUrl = URL.createObjectURL(selectedFile);
			setPreview(objectUrl);
			setImage(false);
			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [param.id, products, selectedFile]);

	const onSelectFile = (e) => {
		if (!isAdmin) return alert("You're not an admin");
		const file = e.target.files[0];
		if (!file) return alert('File not exist.');
		if (file.size > 3 * 1024 * 1024) return alert('Size too large!');
		if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert('File format is incorrect.');
		if (!file) {
			return setSelectedFile(undefined);
		}
		setImage(false);
		setSelectedFile(file);
	};

	const handleDestroy = async () => {
		try {
			if (!isAdmin) return alert("You're not an admin");
			setSelectedFile(undefined);
			setPreview(undefined);
			setImage(false);
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
			if (!selectedFile && !image) return alert('No Image Upload');
			if (selectedFile) {
				const formData = new FormData();
				formData.append('file', selectedFile);
				formData.append('ID', product.ID);
				formData.append('title', product.title);
				formData.append('category', product.category);
				formData.append('price', product.price);
				formData.append('description', product.description);
				formData.append('content', product.content);
				for (let data of formData.values()) {
					console.log(data);
				}
				await axios.put(`${url}/product/${product._id}`, formData, {
					headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
				});
				setCallback(!callback);
				history.push('/');
				return;
			}
			await axios.put(
				`${url}/product/${product._id}`,
				{ ...product },
				{
					headers: { Authorization: token },
				}
			);
			setCallback(!callback);
			history.push('/');
		} catch (err) {
			alert(err.response.data.message);
		}
	};

	const styleUpload = {
		display: image || selectedFile ? 'block' : 'none',
	};
	return (
		<div className="update_product">
			<div className="upload">
				<input type="file" name="file" id="file_up" onChange={onSelectFile} />
				<div id="file_img" style={styleUpload}>
					<img src={preview ? preview : `${url}/${image?.path}`.replace('uploads', '')} alt="" />
					<span onClick={handleDestroy}>X</span>
				</div>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="row">
					<label htmlFor="product_id">Product ID</label>
					<input type="text" name="ID" id="ID" required value={product.ID} onChange={handleChangeInput} />
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

				<button type="submit">Update</button>
			</form>
		</div>
	);
}

export default UpdateProduct;
