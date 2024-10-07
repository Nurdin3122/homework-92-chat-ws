import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {UserReducer} from "../Components/Users/UsersSlice.ts";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from 'redux-persist';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist";

const usersPersistConfig = {
    key: 'chat-ws:user',
    storage,
    whitelist: ['user'],
};

const rootReducer = combineReducers({
    user: persistReducer(usersPersistConfig, UserReducer),
});


export const store = configureStore({
    reducer:rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;