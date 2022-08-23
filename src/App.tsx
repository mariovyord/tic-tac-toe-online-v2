import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import CommonLayout from './components/layouts/CommonLayout';
import { firebaseObserver, loggedIn } from './configs/firebase.config';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoutes from './utils/PrivateRoutes';

interface IState {
	authenticated: boolean,
	isLoading: boolean,
}

export default class App extends Component<{}, IState> {
	constructor({ }) {
		super({});
		this.state = {
			authenticated: loggedIn(),
			isLoading: true,
		}
	}

	componentDidMount() {
		firebaseObserver.subscribe('authStateChanged', (data: any) => {
			this.setState({
				authenticated: data,
				isLoading: false,
			})
		});
	}

	componentWillUnmount() {
		firebaseObserver.unsubscribe('authStateChanged');
	}

	render() {
		return (
			<div>
				<AuthProvider>
					<Routes>
						<Route path='/signin' element={<Auth authenticated={this.state.authenticated} />} />
						<Route element={<PrivateRoutes authenticated={this.state.authenticated} />}>
							<Route path="*" element={<CommonLayout />} />
						</Route>
					</Routes>
				</AuthProvider>
			</div >
		)
	}
}