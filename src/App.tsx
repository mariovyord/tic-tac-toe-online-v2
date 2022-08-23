import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import CommonLayout from './components/layouts/CommonLayout';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoutes } from './utils/PrivateRoutes';

export default class App extends Component {
	render() {
		return (
			<div>
				<AuthProvider>
					<Routes>
						<Route path='/signin' element={<Auth />} />
						<Route element={<PrivateRoutes />}>
							<Route path="*" element={<CommonLayout />} />
						</Route>
					</Routes>
				</AuthProvider>
			</div >
		)
	}
}