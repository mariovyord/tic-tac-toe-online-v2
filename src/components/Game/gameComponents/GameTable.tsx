import React from 'react'
import { THistoryArray } from '../../../types/game.types';
import Cell from './Cell/Cell'

interface IGameTable {
	winningSquares: boolean[],
	history: THistoryArray,
	handleClick: Function,
	step: number,
}

const GameTable: React.FC<IGameTable> = (props) => {
	return (
		<table>
			<tbody>
				<tr>
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={0} />
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={1} />
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={2} />
				</tr>
				<tr>
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={3} />
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={4} />
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={5} />
				</tr>
				<tr>
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={6} />
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={7} />
					<Cell winningSquares={props.winningSquares} current={props.history[props.step]} handleClick={props.handleClick} cellId={8} />
				</tr>
			</tbody>
		</table>
	)
}

export default GameTable;
