import React, { Component } from 'react'
import ai from '../../../utils/ai/ai';

import GameTable from '../gameComponents/GameTable';
import PlayerCard from '../gameComponents/PlayerCard/PlayerCard';
import Winner from '../gameComponents/Winner/Winner';

import style from './GamePvE.module.css';
import { TGameArray, THistoryArray } from '../../../types/game.types';

import { setDoc, doc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { User } from 'firebase/auth';
import { auth, db } from '../../../configs/firebase.config';


interface IState {
	user: null | User,
	userSign: 'x' | 'o',
	computerData: {
		displayName: string,
	},
	computerSign: 'x' | 'o',
	turn: string,
	winner: undefined | 'win' | 'lose' | 'draw',
	history: THistoryArray,
	step: number,
	winningSquares: boolean[],
}

export default class GamePvE extends Component<any, IState> {

	constructor(props: any) {
		super(props);
		this.state = {
			user: null,
			userSign: 'x',
			computerData: {
				displayName: 'AI',
			},
			computerSign: 'o',
			turn: 'x',
			winner: undefined,
			history: [Array(9).fill(undefined)],
			step: 0,
			winningSquares: Array(9).fill(false),
		}
	}

	componentDidMount() {
		const sign1 = Math.floor((Math.random() * 2)) >= 0.5 ? 'x' : 'o';
		const sign2 = sign1 === 'x' ? 'o' : 'x';
		// TODO check how it works  for guest users
		this.setState({
			user: auth.currentUser,
			userSign: sign1,
			computerSign: sign2,
		});

		// check if AI is first and make a move if it is
		setTimeout(() => {
			if (this.state.turn === this.state.computerSign && this.state.history.length === 1) {
				const newHistory = [...this.state.history];
				const computerMove = ai(this.state.computerSign, newHistory[0]);
				this.computerMove(newHistory, computerMove);
			}
		}, 500)
	}

	componentDidUpdate() {
		// check if the game is draw
		const isFull = this.state.history[this.state.step].filter(x => x === undefined);
		if (isFull.length === 0 && this.state.winner === undefined) {
			this.setState({
				winner: 'draw',
			})
		}
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
			if (squares[combo[0]] === undefined || squares[combo[1]] === undefined || squares[combo[2]] === undefined) {
			} else if (squares[combo[0]] === squares[combo[1]] && squares[combo[1]] === squares[combo[2]]) {
				const win = [...this.state.winningSquares];
				win[combo[0]] = true;
				win[combo[1]] = true;
				win[combo[2]] = true;

				// check if user is not anonymous and save game db
				if (this.state.user && this.state.user.uid) {
					const data = {
						owner: this.state.user.uid,
						history: JSON.stringify(this.state.history),
						player1: { displayName: this.state.user.displayName },
						player1Sign: this.state.userSign,
						player2: this.state.computerData,
						player2Sign: this.state.computerSign,
						createdAt: serverTimestamp(),
					}
					const ref = collection(db, "games")
					addDoc(ref, data)
				}

				// end the game
				return this.setState({
					winningSquares: win,
					winner: this.state.userSign === squares[combo[0]] ? 'win' : 'lose',
				});
			}
		}
	}

	computerMove(history: any[][], computerSquares: any) {
		if (this.state.winner !== undefined) return;

		const newHistory = [...history];
		newHistory.push(computerSquares);

		this.setState((state, _) => ({
			turn: state.userSign,
			history: newHistory,
			step: state.step + 1,
		}))

		this.checkForWinner(computerSquares);
	}

	handleClick = (num: number) => {
		const current: TGameArray = this.state.history[this.state.step];

		if (this.state.step !== (this.state.history.length - 1) || this.state.step < 0) return;
		if (this.state.winner !== undefined) return;
		if (this.state.turn === this.state.userSign && current[num] !== undefined) return;
		if (this.state.turn === this.state.computerSign) return;

		const handleTurn = (): any => {
			// add user move to array
			let playersSquares: TGameArray = [...current];
			playersSquares[num] = this.state.userSign;
			// add computer move to second array
			const computerSquares = ai(this.state.computerSign, playersSquares);

			return [playersSquares, computerSquares];
		}

		const [playersSquares, computerSquares] = handleTurn();

		// Player makes a move after little delay
		const newHistory = [...this.state.history];

		newHistory.push(playersSquares);

		this.setState((state, _) => ({
			turn: state.computerSign,
			history: newHistory,
			step: state.step + 1,
		}))

		this.checkForWinner(playersSquares);

		// AI makes a move after little delay
		setTimeout(() => {
			this.computerMove(newHistory, computerSquares);
		}, 500)
	}

	handleRestartGame = () => {
		// reset state
		const sign1 = Math.floor((Math.random() * 2)) >= 0.5 ? 'x' : 'o';
		const sign2 = sign1 === 'x' ? 'o' : 'x';

		this.setState({
			turn: 'x',
			winner: undefined,
			userSign: sign1,
			computerSign: sign2,
			history: [Array(9).fill(undefined)],
			step: 0,
			winningSquares: Array(9).fill(false),
		})

		// check if AI is first and make a move if it is
		setTimeout(() => {
			if (this.state.turn === this.state.computerSign && this.state.history.length === 1) {
				const newHistory = [...this.state.history];
				const computerMove = ai(this.state.computerSign, newHistory[0]);
				this.computerMove(newHistory, computerMove);
			}
		}, 500)

	}
	render() {
		return (
			<div className={`${style.container}`}>
				<div className={style.player1}>
					<PlayerCard displayName={this.state.userSign === 'x' ? this.state.user?.displayName : this.state.computerData.displayName} sign={'x'} yourTurn={this.state.turn === 'x'} />
				</div>
				<div className={style.player2}>
					<PlayerCard displayName={this.state.userSign === 'o' ? this.state.user?.displayName : this.state.computerData.displayName} sign={'o'} yourTurn={this.state.turn === 'o'} />
				</div>
				<div className={style.game}>
					<GameTable winningSquares={this.state.winningSquares} history={this.state.history} step={this.state.step} handleClick={this.handleClick} />
					{this.state.winner && <Winner result={this.state.winner} handleRestartGame={this.handleRestartGame} />}
				</div>
			</div>
		)
	}
}
