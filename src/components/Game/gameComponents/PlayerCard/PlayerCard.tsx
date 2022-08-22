import React, { Component } from 'react';
import style from './PlayerCard.module.css';
import { TUserData } from '../../../../types/user.types';

interface Props {
	userData: TUserData;
	sign: 'x' | 'o',
	yourTurn: boolean,
};

export default class PlayerCard extends Component<Props> {
	render() {
		return (
			<div className={style['player-card']}>
				<h3 className={style['player-name']}>{this.props.userData.firstName}</h3>
				<div className={`${style['turn-card']} ${this.props.yourTurn ? style.active : null}`}>
					<p className={`${style['turn']}`}>{this.props.sign === 'x' ? '✖' : '○'} turn</p>
				</div>
			</div>
		)
	}
}
