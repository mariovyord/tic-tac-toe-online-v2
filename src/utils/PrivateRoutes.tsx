import { Component } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface IProps {
	authenticated: boolean,
}

export class PrivateRoutes extends Component<IProps, any> {
	render() {
		return (
			this.props.authenticated ? <Outlet /> : <Navigate to='/signin' />
		)
	}
}

