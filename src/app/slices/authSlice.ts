import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { RootState } from '../store';

type TAuth = {
	user: null | User,
}

const initialState: TAuth = {
	user: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		logout: (state) => {
			state.user = null;
		}
	}
})

export const authActions = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth.user;

export default authSlice.reducer;