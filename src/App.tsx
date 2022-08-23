import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom';
import { firebaseObserver } from './configs/firebase.config';

import Auth from './components/Auth/Auth';
import CommonLayout from './components/layouts/CommonLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import { Compose } from './utils/Compose';
import { PrivateRoutes } from './utils/PrivateRoutes';

interface IState {
	authenticated: boolean,
}

export default class App extends Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			authenticated: false,
		}
	}

	componentDidMount() {
		firebaseObserver.subscribe('authStateChanged', (isLoggedIn: any) => {
			this.setState({
				authenticated: isLoggedIn,
			})
		});
	}

	componentWillUnmount() {
		firebaseObserver.unsubscribe('authStateChanged');
	}

	render() {
		return (
			<div>
				<Compose components={[NotificationProvider]}>
					<Routes>
						<Route path='/signin' element={<Auth authenticated={this.state.authenticated} />} />
						<Route element={<PrivateRoutes authenticated={this.state.authenticated} />}>
							<Route path="*" element={<CommonLayout />} />
						</Route>
					</Routes>
				</Compose>
			</div >
		)
	}
}