import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface IProps {
	authenticated: boolean,
}

export const PrivateRoutes: React.FC<IProps> = ({ authenticated }) => {
	return (
		authenticated ? <Outlet /> : <Navigate to='/signin' />
	)
}

