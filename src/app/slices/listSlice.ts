import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, DocumentData, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../configs/firebase.config";
import { firebaseDateToString } from "../../utils/utils";
import { RootState } from "../store";

interface IState {
	openGames: DocumentData[],
	status: 'loading' | 'idle' | 'failed',
}

const initialState: IState = {
	openGames: [],
	status: 'loading',
}

export const getList = createAsyncThunk(
	'list/loadGamesList',
	async () => {
		const ref = collection(db, 'activeGames');
		const q = query(ref,
			where("mode", "==", "pvp"),
			where("open", "==", true),
			orderBy("createdAt"),
		);

		return getDocs(q)
			.then((doc) => {
				const result: DocumentData[] = []
				doc.forEach(x => {
					const data = x.data();
					data.id = x.id;
					data.createdAt = firebaseDateToString(data.createdAt);
					result.unshift(data);
				});

				return result;
			})
	}
)

export const listSlice = createSlice({
	name: 'list',
	initialState,
	reducers: {

	},
	extraReducers: (builder) => {
		builder
			.addCase(getList.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(getList.fulfilled, (state, action) => {
				state.openGames = action.payload || [];
				state.status = 'idle';
			})
			.addCase(getList.rejected, (state) => {
				state.status = 'failed';
			})
	}
});

export const listActions = listSlice.actions;
export const selectList = (state: RootState) => state.list;

export default listSlice.reducer;