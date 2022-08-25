import React, { Component } from 'react'

import GameTable from '../../gameComponents/GameTable';
import PlayerCard from '../../gameComponents/PlayerCard/PlayerCard';
import Winner from '../../gameComponents/Winner/Winner';

import style from './GamePvP.module.css';
import { TGameArray, THistoryArray } from '../../../../types/game.types';

import { serverTimestamp, collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { User } from 'firebase/auth';
import { auth, db } from '../../../../configs/firebase.config';
import { withRouter } from '../../../../hoc/withRouter';
import Spinner from '../../../common/Spinner/Spinner';
import { GiTrophiesShelf } from 'react-icons/gi';
import { Navigate } from 'react-router-dom';

interface IState {
	user: null | User,
	userIndex: 0 | 1,
	game: null | any,
	gameId: string,
	xIndex: 0 | 1,
	winner: undefined | 'win' | 'lose' | 'draw',
	winningSquares: boolean[],
	loading: boolean,
	redirect: string,
}

class GamePvP extends Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			user: auth.currentUser,
			userIndex: 0,
			game: null,
			gameId: props.router.params.id,
			xIndex: 0,
			winner: undefined,
			winningSquares: Array(9).fill(false),
			loading: true,
			redirect: '',
		}
	}

	componentDidMount() {
		this.handleUpdateGame()
	}


	componentDidUpdate() {
		// check if the game is draw
		const isFull = this.state.game.history[this.state.game.step].filter((x: any) => !x);

		if (isFull.length === 0 && this.state.winner === undefined) {
			if (this.state.user?.uid === this.state.game.owner && this.state.user?.isAnonymous === false) {
				const data = {
					owner: this.state.user.uid,
					mode: 'pvp',
					history: JSON.stringify([...this.state.game.history]),
					playersIds: this.state.game.playersIds,
					playerDisplayNames: this.state.game.playerDisplayNames,
					playerSigns: this.state.game.playerSigns,
					winner: 'draw',
					createdAt: serverTimestamp(),
				}

				const ref = collection(db, "games")
				addDoc(ref, data)
			}

			return this.setState({
				winner: 'draw',
			})
		}
	}

	handleUpdateGame() {
		onSnapshot(doc(db, "activeGames", this.state.gameId), (doc) => {
			const data = doc.data();

			if (data) {
				const history = JSON.parse(data.history);
				this.setState({
					game: { ...data, history: history },
					loading: false,
					xIndex: data.playerSigns.indexOf('x'),
					userIndex: data.playersIds.indexOf(this.state.user?.uid),
				})
				this.checkForWinner(history[history.length - 1]);
			}
		});
	}

	checkForWinner = (squares: []) => {
		const combos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let combo of combos) {
			if (!squares[combo[0]] || !squares[combo[1]] || !squares[combo[2]]) {
			} else if (squares[combo[0]] === squares[combo[1]] && squares[combo[1]] === squares[combo[2]]) {
				const win = [...this.state.winningSquares];
				win[combo[0]] = true;
				win[combo[1]] = true;
				win[combo[2]] = true;

				// check if user is not anonymous and save game db
				if (this.state.user?.uid === this.state.game.owner && this.state.user?.isAnonymous === false) {
					const data = {
						owner: this.state.user.uid,
						mode: 'pvp',
						history: JSON.stringify([...this.state.game.history, squares]),
						playersIds: this.state.game.playersIds,
						playerDisplayNames: this.state.game.playerDisplayNames,
						playerSigns: this.state.game.playerSigns,
						winner: this.state.game.playerSigns[this.state.userIndex] === squares[combo[0]] ? 'win' : 'lose',
						createdAt: serverTimestamp(),
					}

					const ref = collection(db, "games")
					addDoc(ref, data)
				}

				// end the game
				return this.setState({
					winningSquares: win,
					winner: this.state.game.playerSigns[this.state.userIndex] === squares[combo[0]] ? 'win' : 'lose',
				});
			}
		}
	}

	handleClick = (num: number) => {
		const current: TGameArray = this.state.game.history[this.state.game.step];

		// TODO check if its user turn
		if (this.state.winner !== undefined) return;
		if (this.state.game.turn !== this.state.game.playerSigns[this.state.userIndex] && current[num] !== undefined) return;

		const handleTurn = (): any => {
			// add user move to array
			let playersSquares: TGameArray = [...current];
			playersSquares[num] = this.state.game.playerSigns[this.state.userIndex];
			return [playersSquares];
		}

		const [playersSquares] = handleTurn();

		// Player makes a move after little delay
		const newHistory = [...this.state.game.history];

		newHistory.push(playersSquares);
		console.log('LETS GO');
		const ref = doc(db, "activeGames", this.state.game.id);
		updateDoc(ref, {
			history: JSON.stringify(newHistory),
			step: this.state.game.step + 1,
			turn: this.state.game.turn === 'x' ? 'o' : 'x',
		})
			.catch(err => {
				// TODO ...
				console.log(err);
			})
			.finally(() => {
				this.setState({
					loading: false,
				})
			})
	}

	handleRestartGame = () => {
		this.props.router.navigate('/game/PvP');
	}

	render() {
		if (this.state.loading) {
			return <div className={`${style.container}`}>
				<div></div>
				<Spinner />
				<div></div>
			</div>
		} else if (this.state.redirect !== '') {
			<Navigate to={this.state.redirect} />
		} else {
			return (
				<div className={`${style.container}`}>
					<div className={style.player1}>
						<PlayerCard
							displayName={this.state.game.playerDisplayNames[this.state.xIndex]}
							sign={'x'}
							yourTurn={this.state.game.turn === 'x'} />
					</div>
					<div className={style.player2}>
						<PlayerCard
							displayName={this.state.game.playerDisplayNames[this.state.xIndex === 0 ? 1 : 0]}
							sign={'o'}
							yourTurn={this.state.game.turn === 'o'} />
					</div>
					<div className={style.game}>
						<GameTable
							winningSquares={this.state.winningSquares}
							history={this.state.game.history}
							step={this.state.game.step}
							handleClick={this.handleClick} />
						{this.state.winner && <Winner
							result={this.state.winner}
							handleRestartGame={this.handleRestartGame.bind(this)} />}
					</div>
				</div>
			)
		}
	}
}

export const GamePvPWithRouter = withRouter(GamePvP);