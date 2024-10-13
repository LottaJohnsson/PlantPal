import {configureStore} from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage for web

import plantReducer from './slices/plantSlice';
import userTaskReducer from './slices/userSlice';
import careAdviceReducer from './slices/careAdviceSlice';
import authReducer from './slices/authSlice';
import {combineReducers} from 'redux';

// Define persist configuration
const persistConfig = {
    key: 'root', // Key for the persisted data
    storage, // Storage engine
    whitelist: ['plant', 'task', 'auth', 'careAdvice'], // Slices to persist
};

// Combine the reducers
const rootReducer = combineReducers({
    plant: plantReducer,
    careAdvice: careAdviceReducer,
    task: userTaskReducer,
    auth: authReducer,
});

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export default store;

// Define TypeScript types for the RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
