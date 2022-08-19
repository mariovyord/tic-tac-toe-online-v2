import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { GiMicrochip } from 'react-icons/gi';
import { GiHumanTarget } from 'react-icons/gi';
import styles from './Home.module.css';

export class Home extends Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<div className={styles.games}>
					<Link className={styles['game-link']} to="/game/PvE">
						<div><GiMicrochip size={'100px'} /></div>
						<div>Play vs Artificial Intelligence</div>
					</Link>
					<div className={styles['middle-line']}></div>
					<Link className={styles['game-link']} to="/game/PvP">
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