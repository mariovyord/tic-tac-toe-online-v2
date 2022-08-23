import React, { Component } from 'react'
import { AuthContext } from '../../../contexts/AuthContext';
import ai from '../../../utils/ai/ai';

import { TUserData } from '../../../types/user.types';

import GameTable from '../gameComponents/GameTable';
import PlayerCard from '../gameComponents/PlayerCard/PlayerCard';
import Winner from '../gameComponents/Winner/Winner';

import style from './GamePvE.module.css';

interface IState {
	userData: TUserData,
	userSign: 'x' | 'o',
	computerData: TUserData,
	computerSign: 'x' | 'o',
	turn: string,
	winner: undefined | 'win' | 'lose' | 'draw',
	history: any[][],
	step: number,
	winningSquares: boolean[],
}

// TODO Rewrite for Review Game
export default class GamePvE extends Component<any, IState> {
	static contextType = AuthContext;
	context!: React.ContextType<typeof AuthContext>;

	constructor(props: any) {
		super(props);
		this.state = {
			userData: {
				_id: '',
				firstName: '',
			},
			userSign: 'x',
			computerData: {
				_id: 'super-ai',
				firstName: 'AI',
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

		this.setState({
			userData: this.context.userData,
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

				return this.setState({
					winningSquares: win,
					winner: this.state.userSign === squares[combo[0]] ? 'win' : 'lose',
				});
			}
		}
	}

	handleHistoryJump = (step: number) => {
		return this.setState({
			step: step,
		});
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
		const current = this.state.history[this.state.step];

		if (this.state.step !== (this.state.history.length - 1) || this.state.step < 0) return;
		if (this.state.winner !== undefined) return;
		if (this.state.turn === this.state.userSign && current[num] !== undefined) return;
		if (this.state.turn === this.state.computerSign) return;

		const handleTurn = (): any => {
			// add user move to array
			let playersSquares = [...current];
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
		const sign1 = Math.floor((Math.random() * 2)) >= 0.5 ? 'x' : 'o';
		const sign2 = sign1 === 'x' ? 'o' : 'x';

		this.setState({
			turn: 'x',
			winner: undefined,
			userData: this.context.userData,
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
					<PlayerCard userData={this.state.userSign === 'x' ? this.state.userData : this.state.computerData} sign={'x'} yourTurn={this.state.turn === 'x'} />
				</div>
				<div className={style.player2}>
					<PlayerCard userData={this.state.userSign === 'o' ? this.state.userData : this.state.computerData} sign={'o'} yourTurn={this.state.turn === 'o'} />
				</div>
				<div className={style.game}>
					<GameTable winningSquares={this.state.winningSquares} history={this.state.history} step={this.state.step} handleClick={this.handleClick} />
					{this.state.winner && <Winner result={this.state.winner} handleRestartGame={this.handleRestartGame} />}
					{/* <h3>History:</h3> */}
					{/* <History historyArray={this.state.history} handleHistoryJump={this.handleHistoryJump} /> */}
				</div>
			</div>
		)
	}
}
