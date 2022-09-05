import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { db } from "../../configs/firebase.config";
import { IParsedGame, THistoryArray } from "../../types/game.types";
import { RootState } from "../store";

interface IState {
	userIndex: 0 | 1,
	game: null | IParsedGame,
	gameId: string,
	xIndex: 0 | 1,
	winningSquares: boolean[],
	status: 'loading' | 'idle' | 'failed',
}

interface IEndGame {
	winningSquares: boolean[],
}

const initialState: IState = {
	userIndex: 0,
	game: null,
	gameId: '',
	xIndex: 0,
	winningSquares: Array(9).fill(false),
	status: 'loading',
}

export const createGame = createAsyncThunk(
	'pvp/createGame',
	async () => {

	}
)

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