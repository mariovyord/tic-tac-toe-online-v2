import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Game from '../Game/Game'
import GamePvE from '../Game/GamePvE/GamePvE'
import Home from '../Home/Home'
import Nav from '../Nav/Nav'
import NotFound from '../NotFound/NotFound'
import Profile from '../Profile/Profile'

export default class CommonLayout extends Component {
	render() {
		return (
			<>
				<Nav />
				<main>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/game' >
							<Route path="PvE" element={<GamePvE />} />
							<Route path="PvP" element={<Game />} />
						</Route>
						<Route path='*' element={<NotFound />} />
					</Routes>
				</main >
				<Footer />
			</>
		)
	}
}
