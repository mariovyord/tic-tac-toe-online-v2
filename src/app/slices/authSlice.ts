import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState = {
	user: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {}
})

export const authActions = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth.user;

export default authSlice.reducer;