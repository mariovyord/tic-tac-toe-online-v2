import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const pveSlice = createSlice({
	name: 'pvp',
	initialState: '',
	reducers: {
		test: () => { }
	}
})

export const pveActions = pveSlice.actions;
export const selectPvE = (state: RootState) => state.pve;

export default pveSlice.reducer;