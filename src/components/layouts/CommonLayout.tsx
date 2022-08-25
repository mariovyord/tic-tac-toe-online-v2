import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from '../Footer/Footer'
import GamePvE from '../Game/GamePvE/GamePvE'
import { GamePvPWithRouter } from '../Game/GamePvP/GamePvP/GamePvP'
import { GamesListWithRouter } from '../Game/GamePvP/GamesList/GamesList'
import PvPMenu from '../Game/GamePvP/PvPMenu/PvPMenu'
import { ReviewGameWithRouter } from '../Game/ReviewGame/ReviewGame'
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
							<Route path="PvP" element={<PvPMenu />} />
							<Route path="PvP/list" element={<GamesListWithRouter />} />
							<Route path="PvP/:id" element={<GamePvPWithRouter />} />
							<Route path=":id" element={<ReviewGameWithRouter />} />
						</Route>
						<Route path='*' element={<NotFound />} />
					</Routes>
				</main >
				<Footer />
			</>
		)
	}
}
