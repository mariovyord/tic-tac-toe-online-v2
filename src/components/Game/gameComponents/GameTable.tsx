import React, { Component, EventHandler } from 'react'
import Cell from './Cell/Cell'

interface IGameTable {
	winningSquares: boolean[],
	history: string[][],
	handleClick: Function,
	step: number,
}

export default class GameTable extends Component<any, IGameTable> {
	render() {
		return (
			<table>
				<tbody>
					<tr>
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={0} />
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={1} />
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={2} />
					</tr>
					<tr>
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={3} />
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={4} />
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={5} />
					</tr>
					<tr>
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={6} />
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={7} />
						<Cell winningSquares={this.props.winningSquares} current={this.props.history[this.props.step]} handleClick={this.props.handleClick} cellId={8} />
					</tr>
				</tbody>
			</table>
		)
	}
}
