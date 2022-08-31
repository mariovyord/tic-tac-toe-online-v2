import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom';
import { firebaseObserver } from './configs/firebase.config';

import Auth from './components/Auth/Auth';
import CommonLayout from './components/layouts/CommonLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import { Compose } from './utils/Compose';
import { PrivateRoutes } from './utils/PrivateRoutes';
import { PrivacyPolicy } from './components/PrivacyPolicy/PrivacyPolicy';
import GamePvE from './components/Game/GamePvE/GamePvE'
import { GamePvPWithRouter } from './components/Game/GamePvP/GamePvP/GamePvP'
import { GamesListWithRouter } from './components/Game/GamePvP/GamesList/GamesList'
import PvPMenu from './components/Game/GamePvP/PvPMenu/PvPMenu'
import { ReviewGameWithRouter } from './components/Game/ReviewGame/ReviewGame'
import Home from './components/Home/Home'
import NotFound from './components/NotFound/NotFound'
import Profile from './components/Profile/Profile'

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
						<Route path='/privacypolicy' element={<PrivacyPolicy />} />
						<Route element={<PrivateRoutes authenticated={this.state.authenticated} />}>
							<Route element={<CommonLayout />}>
								<Route path='/' element={<Home />} />
								<Route path='/profile' element={<Profile />} />
								<Route path='/game' >
									<Route path="PvE" element={<GamePvE />} />
									<Route path="PvP" element={<PvPMenu />} />
									<Route path="PvP/list" element={<GamesListWithRouter />} />
									<Route path="PvP/:id" element={<GamePvPWithRouter />} />
									<Route path=":id" element={<ReviewGameWithRouter />} />
								</Route>
								<Route path='*' element={<NotFound />} />
							</Route>
						</Route>
					</Routes>
				</Compose>
			</div >
		)
	}
}