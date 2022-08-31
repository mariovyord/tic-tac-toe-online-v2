import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'

import Nav from '../Nav/Nav'

export default class CommonLayout extends Component {
	render() {
		return (
			<>
				<Nav />
				<main>
					<Outlet />
				</main >
				<Footer />
			</>
		)
	}
}
