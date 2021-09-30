import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import graphDataReducer from "./graphDataSlice";


export const store = configureStore({
    reducer: {
        graphData: graphDataReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['graphProperty/setFiles'],
            },
        }),
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
