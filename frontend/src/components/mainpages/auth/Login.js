import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../../const';

function Login() {
	const [user, setUser] = useState({
		username: '',
		password: '',
	});

	const onChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const loginSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${url}/account/signin`, { ...user });
			localStorage.setItem('firstLogin', true);
			window.location.href = '/';
		} catch (err) {
			alert(err.response.data.msg);
		}
	};

	return (
		<div className="login-page">
			<form onSubmit={loginSubmit}>
				<h2>Login</h2>
				<input
					type="text"
					name="username"
					required
					placeholder="Username"
					value={user.username}
					onChange={onChangeInput}
				/>

				<input
					type="password"
					name="password"
					required
					autoComplete="on"
					placeholder="Password"
					value={user.password}
					onChange={onChangeInput}
				/>

				<div className="row">
					<button type="submit">Login</button>
					<Link to="/register">Register</Link>
				</div>
			</form>
		</div>
	);
}

export default Login;
