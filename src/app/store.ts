import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
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
