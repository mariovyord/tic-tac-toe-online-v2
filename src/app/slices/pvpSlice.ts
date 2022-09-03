import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { db } from "../../configs/firebase.config";
import { IGame, THistoryArray } from "../../types/game.types";
import { RootState } from "../store";

interface IState {
	userIndex: 0 | 1,
	game: null | IGame,
	gameId: string,
	xIndex: 0 | 1,
	winner: undefined | 'x' | 'o' | 'draw',
	winningSquares: boolean[],
	status: 'loading' | 'idle' | 'failed',
}

interface IEndGame {
	winner: 'x' | 'o' | 'draw',
	winningSquares: boolean[],
}

const initialState: IState = {
	userIndex: 0,
	game: null,
	gameId: '',
	xIndex: 0,
	winner: undefined,
	winningSquares: Array(9).fill(false),
	status: 'loading',
}

export const createGame = createAsyncThunk(
	'pvp/createGame',
	async () => {

	}
)

const select = (state: any) => {
	return state.pvp;
}

export const rejoinGame = createAsyncThunk(
	'pvp/rejoinGame',
	async (gameId) => {

	}
)

export const pvpSlice = createSlice({
	name: 'pvp',
	initialState,
	reducers: {
		updateGameState: (state, action: PayloadAction<IState>) => {
			return action.payload;
		},
		endGame: (state, action: PayloadAction<IEndGame>) => {
			return {
				...state,
				winner: action.payload.winner,
				winningSquares: action.payload.winningSquares,
			};
		},
		resetGame: () => {
			return initialState;
		}
	},
});

export const pvpActions = pvpSlice.actions;
export const selectPvP = (state: RootState) => state.pvp;

export default pvpSlice.reducer;