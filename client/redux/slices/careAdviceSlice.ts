import axios from 'axios'
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'

export type CareAdvice = {
    id: string,
    species_id: string,
    common_name: string,
    scientific_name: string[],
    section: any[]
}

type InitialState = {
    loading: boolean
    careAdvice: CareAdvice | null
    error: string
}
const initialState: InitialState = {
    loading: false,
    careAdvice: null,
    error: ''
}

// Generates pending, fulfilled and rejected action types
export const fetchCareAdvice = createAsyncThunk('fetchCareAdvice', (id: string) => {
    console.log('fetching care advice');
    return axios
        .get(`plants/care_advice?query=${encodeURIComponent(id)}`)
        .then(response => response.data.result[0])
})

const careAdviceSlice = createSlice({
    name: 'careAdvice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchCareAdvice.pending, state => {
            state.loading = true
        })
        builder.addCase(
            fetchCareAdvice.fulfilled,
            (state, action: PayloadAction<CareAdvice>) => {
                state.loading = false
                state.careAdvice = action.payload
                state.error = ''
            }
        )
        builder.addCase(fetchCareAdvice.rejected, (state, action) => {
            state.loading = false
            state.careAdvice = null
            state.error = action.error.message || 'Something went wrong'
        })
    }
})

export default careAdviceSlice.reducer
