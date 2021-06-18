import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../../const';

function Register() {
	const [user, setUser] = useState({
		username: '',
		fullName: '',
		password: '',
		confirmPassword: '',
		masterPassword: '',
	});

	const onChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const registerSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${url}/account/`, { ...user });
			localStorage.setItem('firstLogin', true);
			window.location.href = '/';
		} catch (err) {
			alert(err.response.data.msg);
		}
	};

	return (
		<div className="login-page">
			<form onSubmit={registerSubmit}>
				<h2>Register</h2>
				<input
					type="text"
					name="username"
					required
					placeholder="Username"
					value={user.username}
					onChange={onChangeInput}
				/>

				<input
					type="text"
					name="fullName"
					required
					placeholder="Full Name"
					value={user.fullName}
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

				<input
					type="password"
					name="confirmPassword"
					required
					autoComplete="on"
					placeholder="Config Password"
					value={user.confirmPassword}
					onChange={onChangeInput}
				/>

				<input
					type="password"
					name="masterPassword"
					autoComplete="on"
					placeholder="Master Password"
					value={user.masterPassword}
					onChange={onChangeInput}
				/>

				<div className="row">
					<button type="submit">Register</button>
					<Link to="/login">Login</Link>
				</div>
			</form>
		</div>
	);
}

export default Register;
