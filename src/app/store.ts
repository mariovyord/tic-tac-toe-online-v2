import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import pvpReducer from './slices/pvpSlice';
import pveReducer from './slices/pveSlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		pvp: pvpReducer,
		pve: pveReducer,
		review: reviewReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types
				ignoredActions: ['auth/login'],
				// Ignore these field paths in all actions
				ignoredActionPaths: ['auth.user'],
				// Ignore these paths in the state
				ignoredPaths: ['auth.user'],
			},
		}),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
