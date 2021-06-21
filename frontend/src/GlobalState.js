import React, { createContext, useEffect, useState } from 'react';
import ProductsAPI from './api/ProductsAPI';
import UserAPI from './api/UserAPI';
import CategoriesAPI from './api/CategoriesAPI';
import axios from 'axios';
import { url } from './const';

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
	const [token, setToken] = useState(false);
	useEffect(() => {
		const firstLogin = localStorage.getItem('firstLogin');
		const refreshtoken = localStorage.getItem('refreshToken');
		if (firstLogin) {
			const refreshToken = async () => {
				const res = await axios.get(`${url}/account/refresh_token`, {
					headers: { 'content-type': 'multipart/form-data', Authorization: refreshtoken },
				});
				setToken(res.data.accessToken);
				localStorage.setItem('accessToken', res.data.accessToken);
				setTimeout(() => {
					refreshToken();
				}, 10 * 60 * 1000);
			};
			refreshToken();
		}
	}, []);

	const state = {
		token: [token, setToken],
		productsAPI: ProductsAPI(),
		userAPI: UserAPI(token),
		categoriesAPI: CategoriesAPI(),
	};

	return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
