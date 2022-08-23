import { Component } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthLib } from '../../../utils/AuthLib';
import './NavList.css';
import { app } from '../../../configs/firebase.config';

export default class NavList extends Component {
	render() {
		return (
			<>
				<li><NavLink to="/" >Home</NavLink></li>
				<li><NavLink to="/profile" >Profile</NavLink></li>
				<li><span onClick={() =>
					AuthLib.handleLogout(app)}>Logout</span></li>
			</>
		)
	}
}
