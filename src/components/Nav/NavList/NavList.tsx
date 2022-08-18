import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class NavList extends Component {
	render() {
		return (
			<>
				<li><NavLink to="/">Home</NavLink></li>
				<li><NavLink to="/tic-tac-toe">Game</NavLink></li>
				<li><NavLink to="/profile">Profile</NavLink></li>
			</>
		)
	}
}
