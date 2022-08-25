import React, { Component } from 'react'

import GameTable from '../../gameComponents/GameTable';
import PlayerCard from '../../gameComponents/PlayerCard/PlayerCard';
import Winner from '../../gameComponents/Winner/Winner';

import style from './GamePvP.module.css';
import { TGameArray, THistoryArray } from '../../../../types/game.types';

import { serverTimestamp, collection, addDoc, onSnapshot, doc } from "firebase/firestore";
import { User } from 'firebase/auth';
import { auth, db } from '../../../../configs/firebase.config';
import { withRouter } from '../../../../hoc/withRouter';
import Spinner from '../../../common/Spinner/Spinner';

interface IState {
	user: null | User,
	game: null | any,
	gameId: string,
	turn: string,
	xIndex: 0 | 1,
	winner: undefined | 'win' | 'lose' | 'draw',
	step: number,
	winningSquares: boolean[],
	loading: boolean,
}

class GamePvP extends Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			user: auth.currentUser,
			game: null,
			gameId: props.router.params.id,
			turn: 'x',
			xIndex: 0,
			winner: undefined,
			step: 0,
			winningSquares: Array(9).fill(false),
			loading: true,
		}
	}

	componentDidMount() {
		onSnapshot(doc(db, "activeGames", this.state.gameId), (doc) => {
			const data = doc.data();
			if (data) {
				this.setState({
					game: { ...data, history: JSON.parse(data.history) },
					loading: false,
					xIndex: data.playerSigns.indexOf('x'),
				})
			}
		});
	}

	componentDidUpdate() {

	}

	checkForWinner = (squares: []) => {
		return undefined;
	}

	handleClick = (num: number) => {

	}

	handleRestartGame = () => {

	}

	render() {
		if (this.state.loading) {
			return <div className={`${style.container}`}>
				<div></div>
				<Spinner />
				<div></div>
			</div>
		} else {
			return (
				<div className={`${style.container}`}>
					<div className={style.player1}>
						<PlayerCard
							displayName={this.state.game.playerDisplayNames[this.state.xIndex]}
							sign={'x'}
							yourTurn={this.state.turn === 'x'} />
					</div>
					<div className={style.player2}>
						<PlayerCard
							displayName={this.state.game.playerDisplayNames[this.state.xIndex === 0 ? 1 : 0]}
							sign={'o'}
							yourTurn={this.state.turn === 'o'} />
					</div>
					<div className={style.game}>
						<GameTable
							winningSquares={this.state.winningSquares}
							history={this.state.game.history}
							step={this.state.step}
							handleClick={this.handleClick} />
						{this.state.winner && <Winner
							result={this.state.winner}
							handleRestartGame={this.handleRestartGame} />}
					</div>
				</div>
			)
		}
	}
}

export const GamePvPWithRouter = withRouter(GamePvP);