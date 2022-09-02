import { NavLink } from 'react-router-dom';
import { AuthLib } from '../../../utils/AuthLib';
import './NavList.css';
import { app } from '../../../configs/firebase.config';

const NavList = () => {
	return (
		<>
			<li><NavLink to="/" >Home</NavLink></li>
			<li><NavLink to="/profile" >Profile</NavLink></li>
			<li><a href='/logout' className='logoutBtn' onClick={(e) => {
				e.preventDefault();
				AuthLib.handleLogout(app)
			}}>Logout</a></li>
		</>
	)
}

export default NavList;