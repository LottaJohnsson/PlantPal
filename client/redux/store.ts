import {configureStore} from '@reduxjs/toolkit'
import plantReducer from './slices/plantSlice'
import userTaskReducer from './slices/userSlice'
import careAdviceReducer from './slices/careAdviceSlice'
import authReducer from './slices/authSlice'

const store = configureStore({
    reducer: {
        plant: plantReducer,
        careAdvice: careAdviceReducer,
        task: userTaskReducer,
        auth: authReducer,
    }
})

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch