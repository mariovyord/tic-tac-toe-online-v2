import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/firebase.config';
import { RootState } from '../store';

interface IReviewState {
	game: null | any,
	step: number,
	winningSquares: boolean[],
	status: 'loading' | 'idle' | 'failed',
}

const initialState: IReviewState = {
	game: null,
	step: 1,
	winningSquares: Array(9).fill(false),
	status: 'loading',
}

export const fetchGameAsync = createAsyncThunk(
	'review/fetchGameAsync',
	async (gameId: string) => {
		const docRef = doc(db, "games", gameId!);

		return getDoc(docRef)
			.then((docs) => docs.data())
	}
);

export const reviewSlice = createSlice({
	name: 'review',
	initialState,
	reducers: {
		jumpToStep: (state, action: PayloadAction<number>) => {
			state.step = action.payload;
		},
		setWinnner: (state, action: PayloadAction<boolean[]>) => {
			state.winningSquares = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGameAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchGameAsync.fulfilled, (state, action) => {
				state.game = action.payload;
				state.status = 'idle';
			})
			.addCase(fetchGameAsync.rejected, (state) => {
				state.status = 'failed';
			})
	}
});

export const reviewActions = reviewSlice.actions;
export const selectReview = (state: RootState) => state.review;

export default reviewSlice.reducer;