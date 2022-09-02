import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectAuth } from '../app/slices/authSlice';

export const PrivateRoutes: React.FC = () => {
	const user = useAppSelector(selectAuth);

	return (
		user ? <Outlet /> : <Navigate to='/signin' />
	)
}

