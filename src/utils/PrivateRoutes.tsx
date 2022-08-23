import { Component } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export class PrivateRoutes extends Component {
	static contextType = AuthContext;
	context!: React.ContextType<typeof AuthContext>;

	render() {
		return (
			this.context.authenticated ? <Outlet /> : <Navigate to='/signin' />
		)
	}
}

