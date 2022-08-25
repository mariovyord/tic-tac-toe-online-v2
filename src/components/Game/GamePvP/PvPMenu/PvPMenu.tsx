import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { IoIosLogIn } from 'react-icons/io';
import { IoIosCheckboxOutline } from 'react-icons/io';

export class PvPMenu extends Component {
	render() {
		return (
			<div className={'games-wrapper'}>
				<div className={'games'}>
					<Link className={'game-link'} to="/game/PvE">
						<div><IoIosCheckboxOutline size={'100px'} /></div>
						<div>Create game</div>
					</Link>
					<Link className={'game-link'} to="/game/PvP">
						<IoIosLogIn size={'100px'} />
						<div></div>
						<div>
							Join game
						</div>
					</Link>
				</div>
			</div>
		)
	}
}

export default PvPMenu;