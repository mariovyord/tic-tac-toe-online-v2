import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const pvpSlice = createSlice({
	name: 'pvp',
	initialState: '',
	reducers: {
		test: () => { }
	}
});

export const gameActions = pvpSlice.actions;
export const selectGame = (state: RootState) => state.pvp;

export default pvpSlice.reducer;