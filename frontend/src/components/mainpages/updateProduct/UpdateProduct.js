import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { useHistory, useParams } from 'react-router-dom';
import { url } from '../../../const';
import UploadImage from '../utils/uploadImage/uploadImage';
import FormProduct from '../utils/formProduct/formProduct';
import ImagesShow from '../utils/imagesShow/imagesShow';

const initialState = {
	ID: '',
	title: 'title',
	price: 0,
	description: 'description',
	content: 'content',
	category: '',
};
function UpdateProduct() {
	const state = useContext(GlobalState);
	const [product, setProduct] = useState(initialState);
	const [categories] = state.categoriesAPI.categories;
	const [isAdmin] = state.userAPI.isAdmin;
	const [token] = state.token;

	const history = useHistory();
	const param = useParams();

	const [products] = state.productsAPI.products;
	const [callback, setCallback] = state.productsAPI.callback;

	const [images, setImages] = React.useState([]);
	const [slide, setSlide] = useState([]);
	const maxNumber = 69;

	useEffect(() => {
		products.forEach((product) => {
			if (product._id === param.id) {
				setProduct(product);
				setSlide(product.slide);
			}
		});
	}, [param.id, products]);

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
			const formData = new FormData();
			formData.append('ID', product.ID);
			formData.append('title', product.title);
			formData.append('category', product.category);
			formData.append('price', product.price);
			formData.append('description', product.description);
			formData.append('content', product.content);
			Array.from(images).forEach((image) => formData.append('files', image.file));
			await axios.put(`${url}/product/${product._id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
			});
			setCallback(!callback);
			history.push('/');
		} catch (err) {
			alert(err.response.data.message);
		}
	};

	return (
		<div className="update_product">
			<div className="row">
				<ImagesShow images={slide} productId={product._id} />
			</div>

			<FormProduct
				product={product}
				categories={categories}
				handleSubmit={handleSubmit}
				name="Update"
				handleChangeInput={handleChangeInput}
			/>

			<div className="row">
				<UploadImage images={images} handlerUpload={onChange} maxNumber={maxNumber} />
			</div>
		</div>
	);
}

export default UpdateProduct;
