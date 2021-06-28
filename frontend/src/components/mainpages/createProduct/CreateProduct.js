import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { useHistory } from 'react-router-dom';
import { url } from '../../../const';
import UploadImage from '../utils/uploadImage/uploadImage';
import FormProduct from '../utils/formProduct/formProduct';

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

	const onChange = (imageList) => {
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
			<div className="image_upload">
				<UploadImage images={images} handlerUpload={onChange} maxNumber={maxNumber} />
			</div>

			<FormProduct
				product={product}
				categories={categories}
				handleSubmit={handleSubmit}
				name="Create"
				handleChangeInput={handleChangeInput}
			/>
		</div>
	);
}

export default CreateProduct;
