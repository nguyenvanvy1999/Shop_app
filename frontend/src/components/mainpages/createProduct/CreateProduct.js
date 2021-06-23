import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { useHistory } from 'react-router-dom';
import { url } from '../../../const';
import ImageUploading from 'react-images-uploading';

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
	const [images, setImages] = React.useState([]);
	const maxNumber = 69;

	const onChange = (imageList, addUpdateIndex) => {
		setImages(imageList);
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
			Array.from(images).forEach((image) => formData.append('files', image.file));
			for (var value of formData.entries()) {
				console.log(value);
			}
			await axios.post(`${url}/product`, formData, {
				headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
			});
			setCallback(!callback);
			history.push('/');
		} catch (err) {
			alert(err.response.data.message);
		}
	};
	return (
		<div className="create_product">
			<form onSubmit={handleSubmit}>
				<ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber} dataURLKey="data_url">
					{({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
						<div className="upload__image-wrapper">
							<button style={isDragging ? { color: 'red' } : undefined} onClick={onImageUpload} {...dragProps}>
								Click or Drop here
							</button>
							&nbsp;
							<button onClick={onImageRemoveAll}> Remove all images</button>
							{imageList.map((image, index) => (
								<div key={index} className="image-item">
									<img src={image['data_url']} alt="" width={100} height={100} />
									<div className="image-item__btn-wrapper">
										<button onClick={() => onImageUpdate(index)}>Update</button>
										<button onClick={() => onImageRemove(index)}>Remove</button>
									</div>
								</div>
							))}
						</div>
					)}
				</ImageUploading>
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
