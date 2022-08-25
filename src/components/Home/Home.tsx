import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { GiMicrochip } from 'react-icons/gi';
import { GiHumanTarget } from 'react-icons/gi';

export class Home extends Component {
	render() {
		return (
			<div className={'games-wrapper'}>
				<div className={'games'}>
					<Link className={'game-link'} to="/game/PvE">
						<div><GiMicrochip size={'100px'} /></div>
						<div>Play vs Artificial Intelligence</div>
					</Link>
					<Link className={'game-link'} to="/game/PvP">
						<GiHumanTarget size={'100px'} />
						<div></div>
						<div>
							Play vs Real Players
						</div>
					</Link>
				</div>
			</div>
		)
	}
}

export default Home;