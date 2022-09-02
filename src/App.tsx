import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { firebaseObserver } from './configs/firebase.config';

import Auth from './components/Auth/Auth';
import CommonLayout from './components/layouts/CommonLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import { Compose } from './utils/Compose';
import { PrivateRoutes } from './utils/PrivateRoutes';
import { PrivacyPolicy } from './components/PrivacyPolicy/PrivacyPolicy';

import GamePvE from './components/Game/GamePvE/GamePvE'
import GamePvP from './components/Game/GamePvP/GamePvP/GamePvP'
import GamesList from './components/Game/GamePvP/GamesList/GamesList'
import PvPMenu from './components/Game/GamePvP/PvPMenu/PvPMenu'
import { ReviewGameWithRouter } from './components/Game/ReviewGame/ReviewGame'
import Home from './components/Home/Home'
import NotFound from './components/NotFound/NotFound'
import Profile from './components/Profile/Profile'
import { User } from 'firebase/auth';
import { useAppDispatch } from './app/hooks';
import { authActions } from './app/slices/authSlice';

const App: React.FC = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		firebaseObserver.subscribe('authStateChanged', (user: null | User) => {
			if (user) {
				dispatch(authActions.login(user));
			} else {
				dispatch(authActions.logout());
			}
		});
		return () => {
			firebaseObserver.unsubscribe('authStateChanged');
		}
	}, [dispatch])

	return (
		<div>
			<Routes>
				<Route path='/signin' element={<Auth />} />
				<Route path='/privacypolicy' element={<PrivacyPolicy />} />
				<Route element={<PrivateRoutes />}>
					<Route element={<CommonLayout />}>
						<Route path='/' element={<Home />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/game' >
							<Route path="PvE" element={<GamePvE />} />
							<Route path="PvP" element={<PvPMenu />} />
							<Route path="PvP/list" element={<GamesList />} />
							<Route path="PvP/:id" element={<GamePvP />} />
							<Route path=":id" element={<ReviewGameWithRouter />} />
						</Route>
						<Route path='*' element={<NotFound />} />
					</Route>
				</Route>
			</Routes>
		</div >
	)
}

export default App;