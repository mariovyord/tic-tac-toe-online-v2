import React, { Component } from 'react'
import style from './PlayerCard.module.css'

interface Props {
	playerName: string;
	yourTurn: boolean,
};

export default class PlayerCard extends Component<Props> {
	render() {
		return (
			<div className={style['player-card']}>
				<h3 className={style['player-name']}>{this.props.playerName}</h3>
				<div className={`${style['turn-card']} ${this.props.yourTurn ? style.active : null}`}>
					<p className={`${style['turn']}`}>your turn</p>
				</div>
			</div>
		)
	}
}
