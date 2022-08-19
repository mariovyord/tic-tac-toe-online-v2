import React, { Component } from 'react'

import Cell from '../gameComponents/Cell/Cell';
import History from '../gameComponents/History/History';
import NewGameButton from '../gameComponents/NewGamebutton/NewGameButton';
import Winner from '../gameComponents/Winner/Winner';

import style from './GamePvE.module.css';

interface IState {
	turn: string,
	winner: undefined | string,
	history: string[][],
	step: number,
	winningSquares: boolean[],
}

export default class GamePvE extends Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			turn: 'x',
			winner: undefined,
			history: [Array(9).fill(undefined)],
			step: 0,
			winningSquares: Array(9).fill(false),
		}
	}

	checkForWinner = (squares: string[]) => {
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
					winner: squares[combo[0]]
				});
			}
		}
	}

	handleHistoryJump = (step: number) => {
		return this.setState({
			step: step,
		});
	}

	handleClick = (num: number) => {
		const current = this.state.history[this.state.step];

		if (this.state.step !== (this.state.history.length - 1) || this.state.step < 0) return;
		if (current[num] !== undefined) return;
		if (this.state.winner !== undefined) return;

		const handleTurn = () => {
			let squares = [...current];
			if (this.state.turn === 'x') {
				squares[num] = 'x';
				this.setState({
					turn: 'o'
				})
			} else {
				squares[num] = 'o';
				this.setState({
					turn: 'x'
				})
			}
			return squares;
		}

		const currentGameState = handleTurn();

		const newHistory = [...this.state.history];
		newHistory.push(currentGameState);

		this.setState({
			history: newHistory,
			step: this.state.step + 1,
		})

		this.checkForWinner(currentGameState);
	}

	handleRestartGame = () => {
		return this.setState({
			turn: 'x',
			winner: undefined,
			history: [Array(9).fill(undefined)],
			step: 0,
			winningSquares: Array(9).fill(false),
		})
	}
	render() {
		return (
			<div className={`${style.container}`}>
				<div className={style.game}>
					<table>
						<tbody>
							<tr>
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={0} />
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={1} />
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={2} />
							</tr>
							<tr>
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={3} />
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={4} />
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={5} />
							</tr>
							<tr>
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={6} />
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={7} />
								<Cell winningSquares={this.state.winningSquares} current={this.state.history[this.state.step]} handleClick={this.handleClick} cellId={8} />
							</tr>
						</tbody>
					</table>
					<div className={style.menu}>
						{this.state.winner && <Winner winner={this.state.winner} />}
						<NewGameButton handleRestartGame={this.handleRestartGame} />
						<h3>History:</h3>
						<History historyArray={this.state.history} handleHistoryJump={this.handleHistoryJump} />
					</div>
				</div>
			</div>
		)
	}
}
