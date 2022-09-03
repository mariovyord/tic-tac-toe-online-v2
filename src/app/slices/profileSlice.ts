import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, DocumentData, getDocs, limitToLast, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../configs/firebase.config';
import { RootState } from '../store';

type TState = {
	pveGames: any[],
	pvpGames: any[],
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
		const ref = collection(db, 'games');

		const queryPvE = query(ref,
			where("playersIds", "array-contains", userId),
			where("mode", "==", "pve"),
			orderBy("createdAt"),
			limitToLast(10),
		);

		const pveGames = getDocs(queryPvE)
			.then((doc) => {
				const games: any[] = [];
				doc.forEach(x => {
					const data = x.data();
					data.id = x.id;
					data.createdAt = data.createdAt.toDate().toISOString();
					games.push(data);

				});
				return games;
			})

		const queryPvP = query(ref,
			where("playersIds", "array-contains", userId),
			where("mode", "==", "pvp"),
			orderBy("createdAt"),
			limitToLast(10),
		);

		const pvpGames = getDocs(queryPvP)
			.then((doc) => {
				const games: any[] = [];
				doc.forEach(x => {
					const data = x.data();
					data.id = x.id;
					data.createdAt = data.createdAt.toDate().toISOString();
					games.push(data);
				});
				return games;
			})

		return Promise.all([pveGames, pvpGames])
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
				const [pveGames, pvpGames] = action.payload;
				state.pveGames = pveGames;
				state.pvpGames = pvpGames;
				state.status = 'idle';
			})
			.addCase(fetchUserHistory.rejected, (state) => {
				state.status = 'failed';
			})
	}
});

export const profileActions = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile;

export default profileSlice.reducer;