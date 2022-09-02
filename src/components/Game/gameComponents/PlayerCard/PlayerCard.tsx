import React from 'react';
import style from './PlayerCard.module.css';

interface Props {
	displayName: null | undefined | string,
	sign: 'x' | 'o',
	yourTurn: boolean,
};

const PlayerCard: React.FC<Props> = (props) => {
	return (
		<div className={style['player-card']}>
			<h3 className={style['player-name']}>{props.displayName?.split(' ')[0] || 'Anonymous'}</h3>
			<div className={`${style['turn-card']} ${props.yourTurn ? style.active : null}`}>
				<p className={`${style['turn']}`}>{props.sign === 'x' ? '✖' : '○'} turn</p>
			</div>
		</div>
	)
}

export default PlayerCard;