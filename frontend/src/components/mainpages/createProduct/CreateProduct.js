import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { useHistory } from 'react-router-dom';
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
	const formData = new FormData();
	const state = useContext(GlobalState);
	const [product, setProduct] = useState(initialState);
	const [categories] = state.categoriesAPI.categories;
	const [isAdmin] = state.userAPI.isAdmin;
	const [token] = state.token;
	const history = useHistory();
	const [callback, setCallback] = state.productsAPI.callback;
	const [selectedFile, setSelectedFile] = useState();
	const [preview, setPreview] = useState();
	useEffect(() => {
		if (!selectedFile) {
			setPreview(undefined);
			return;
		}
		const objectUrl = URL.createObjectURL(selectedFile);
		setPreview(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [selectedFile]);

	const handleDestroy = () => {
		setSelectedFile(undefined);
		formData.delete('file');
	};

	const onSelectFile = (e) => {
		if (!isAdmin) return alert("You're not an admin");
		const file = e.target.files[0];
		if (!file) return alert('File not exist.');
		if (file.size > 3 * 1024 * 1024) return alert('Size too large!');
		if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert('File format is incorrect.');
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedFile(undefined);
			return;
		}
		setSelectedFile(file);
	};

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setProduct({ ...product, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!isAdmin) return alert("You're not an admin");
			formData.append('ID', product.ID);
			formData.append('title', product.title);
			formData.append('category', product.category);
			formData.append('price', product.price);
			formData.append('description', product.description);
			formData.append('content', product.content);
			formData.append('file', selectedFile);
			await axios.post(`${url}/product`, formData, {
				headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
			});
			setCallback(!callback);
			history.push('/');
		} catch (err) {
			alert(err.response.data.message);
		}
	};
	const styleUpload = {
		display: selectedFile ? 'block' : 'none',
	};
	return (
		<div className="create_product">
			<div className="upload">
				<input type="file" name="file" id="file_up" onChange={onSelectFile} />
				<div id="file_img" style={styleUpload}>
					<img src={preview} alt="" />
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

				<button type="submit">Create</button>
			</form>
		</div>
	);
}

export default CreateProduct;
