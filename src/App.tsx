import React, { Component } from 'react'
import Auth from './components/Auth/Auth';
import Footer from './components/Footer/Footer';
import Game from './components/Game/Game';
import Home from './components/Home/Home';
import Nav from './components/Nav/Nav';

export default class App extends Component {
	render() {
		return (
			<div>
				<Nav />
				<main>
					<Home />
				</main >
				<Footer />
			</div >
		)
	}
}