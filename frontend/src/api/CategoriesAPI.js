import { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../const';

function CategoriesAPI() {
	const [categories, setCategories] = useState([]);
	const [callback, setCallback] = useState(false);

	useEffect(() => {
		const getCategories = async () => {
			const res = await axios.get(`${url}/category`);
			setCategories(res.data);
		};

		getCategories();
	}, [callback]);
	return {
		categories: [categories, setCategories],
		callback: [callback, setCallback],
	};
}

export default CategoriesAPI;
