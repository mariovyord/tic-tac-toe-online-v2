import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IParsedGame, TGameArray } from '../../types/game.types';
import { RootState } from '../store';

interface IState {
	gameId: string,
	game: IParsedGame,
	userIndex: 0 | 1,
	xIndex: 0 | 1,
	winningSquares: boolean[],
	status: 'loading' | 'idle' | 'failed',
}

interface IEndGame {
	winningSquares: boolean[],
	winner: 'x' | 'o' | 'draw'
}

interface IStartGame {
	userId: string,
	displayName: string,
	signs: ["x" | "o", "x" | "o"],
}

const initialState: IState = {
	userIndex: 0,
	game: {
		owner: '',
		playersIds: ['', ''],
		playerDisplayNames: ['action.payload.displayName', 'AI'],
		playerSigns: ['x', 'o'],
		mode: 'pve',
		open: false,
		finished: false,
		winner: null,
		step: 0,
		turn: 'x',
		history: [Array(9).fill(null)],
		createdAt: '',
	},
	gameId: '',
	xIndex: 0,
	winningSquares: Array(9).fill(false),
	status: 'loading',
}

export const pveSlice = createSlice({
	name: 'pve',
	initialState,
	reducers: {
		startGame: (state, action: PayloadAction<IStartGame>) => {
			state.game.owner = action.payload.userId;
			state.game.playersIds = [action.payload.userId, ''];
			state.game.playerDisplayNames = [action.payload.displayName, 'AI'];
			state.game.playerSigns = action.payload.signs;
			state.xIndex = action.payload.signs[0] === 'x' ? 0 : 1;
			state.winningSquares = Array(9).fill(false);
			state.status = 'idle';
		},
		makeAMove: (state, action: PayloadAction<TGameArray>) => {
			if (state.game) {
				state.game.history.push(action.payload);

				const currentTurn = state.game?.turn;
				state.game.turn = currentTurn === 'x' ? 'o' : 'x';

				state.game.step++;
			}
		},
		endGame: (state, action: PayloadAction<IEndGame>) => {
			state.game.winner = action.payload.winner;
			state.game.finished = true;
			state.winningSquares = action.payload.winningSquares;
		},
		resetGame: () => {
			return initialState;
		}
	},
})

export const pveActions = pveSlice.actions;
export const selectPvE = (state: RootState) => state.pve;

export default pveSlice.reducer;