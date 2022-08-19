import React, { Component } from 'react'
import style from './PlayerCard.module.css'

interface Props {
	playerName: string;
};

export default class PlayerCard extends Component<Props> {
	render() {
		return (
			<div className={style['player-card']}>
				<h3 className={style['player-name']}>{this.props.playerName}</h3>
				<p className={style['turn']}>Turn: X</p>
			</div>
		)
	}
}
