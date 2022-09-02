import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, DocumentData, getDocs, limitToLast, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../configs/firebase.config';
import { RootState } from '../store';

type TGamesHistory = {
	pveGames: DocumentData[],
	pvpGames: DocumentData[]
}

type TState = {
	pveGames: DocumentData[],
	pvpGames: DocumentData[],
	status: 'loading' | 'idle' | 'failed',
}

const initialState: TState = {
	pveGames: [],
	pvpGames: [],
	status: 'loading',
}

export const fetchUserHistory = createAsyncThunk(
	'profile/fetchUserHistory',
	async (userId: string) => {
		const games: TGamesHistory = {
			pveGames: [],
			pvpGames: []
		}

		const ref = collection(db, 'games');

		const queryPvE = query(ref,
			where("playersIds", "array-contains", userId),
			where("mode", "==", "pve"),
			orderBy("createdAt"),
			limitToLast(10),
		);

		getDocs(queryPvE)
			.then((doc) => {
				doc.forEach(x => {
					const data = x.data();
					data.id = x.id;
					games.pveGames.unshift(data);
				});
			})

		const queryPvP = query(ref,
			where("playersIds", "array-contains", userId),
			where("mode", "==", "pvp"),
			orderBy("createdAt"),
			limitToLast(10),
		);

		getDocs(queryPvP)
			.then((doc) => {
				doc.forEach(x => {
					const data = x.data();
					data.id = x.id;
					games.pvpGames.unshift(data);
				});
			})

		return games;
	}
)

export const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		test: () => { }
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserHistory.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchUserHistory.fulfilled, (state, action) => {
				state.pveGames = action.payload.pveGames;
				state.pvpGames = action.payload.pvpGames;
				state.status = 'idle';
			})
			.addCase(fetchUserHistory.rejected, (state) => {
				state.status = 'failed';
			})
	}
});

export const profileActions = profileSlice.actions;
export const selectProfile = (state: RootState) => state.review;

export default profileSlice.reducer;