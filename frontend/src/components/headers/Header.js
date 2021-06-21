import React, { useContext, useState } from 'react';
import { GlobalState } from '../../GlobalState';
import Menu from './icon/menu.svg';
import Close from './icon/close.svg';
import { Link } from 'react-router-dom';

function Header() {
	const state = useContext(GlobalState);
	const [isLogged] = state.userAPI.isLogged;
	const [isAdmin] = state.userAPI.isAdmin;
	const [menu, setMenu] = useState(false);

	const logoutUser = async () => {
		localStorage.removeItem('firstLogin');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		window.location.href = '/';
	};

	const adminRouter = () => {
		return (
			<>
				<li>
					<Link to="/create_product">Create Product</Link>
				</li>
				<li>
					<Link to="/category">Categories</Link>
				</li>
			</>
		);
	};

	const loggedRouter = () => {
		return (
			<>
				<li>
					<Link to="/" onClick={logoutUser}>
						Logout
					</Link>
				</li>
			</>
		);
	};

	const styleMenu = {
		left: menu ? 0 : '-100%',
	};

	return (
		<header>
			<div className="menu" onClick={() => setMenu(!menu)}>
				<img src={Menu} alt="" width="30" />
			</div>

			<div className="logo">
				<h1>
					<Link to="/">{isAdmin ? 'Admin' : 'TestShop'}</Link>
				</h1>
			</div>

			<ul style={styleMenu}>
				<li>
					<Link to="/">{isAdmin ? 'Products' : 'Shop'}</Link>
				</li>

				{isAdmin && adminRouter()}

				{isLogged ? (
					loggedRouter()
				) : (
					<li>
						<Link to="/login">Login ✥ Register</Link>
					</li>
				)}

				<li onClick={() => setMenu(!menu)}>
					<img src={Close} alt="" width="30" className="menu" />
				</li>
			</ul>
		</header>
	);
}

export default Header;
