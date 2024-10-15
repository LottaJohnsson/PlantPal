import axios from 'axios'
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'

export type Plant = {
    id: string;
    common_name: string;
    scientific_name: string[];
    other_name: string[];
    cycle: string;
    watering: string;
    sunlight: string[];
    default_image: {
        license: number;
        license_name: string;
        license_url: string;
        original_url: string;
        regular_url: string;
        medium_url: string;
        small_url: string;
        thumbnail: string;
    };
};

type PlantState = {
    loading: boolean
    plants: Plant[]
    currentPlant: Plant | null
    uploadPlant: Plant | null
    error: string
}
const initialState: PlantState = {
    loading: false,
    plants: [],
    currentPlant: null,
    uploadPlant: null,
    error: ''
}

export const fetchPlants = createAsyncThunk('fetchPlants', (query: string) => {
    return axios
        .get(`plants/search?query=${encodeURIComponent(query)}`)
        .then(response => response.data.data)
})

const plantSlice = createSlice({
    name: 'plant',
    initialState,
    reducers: {
        setCurrentPlant: (state, action: PayloadAction<Plant>) => {
            state.currentPlant = action.payload
        },
        setUploadPlant: (state, action: PayloadAction<Plant | null>) => {
            state.uploadPlant = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchPlants.pending, state => {
            state.loading = true
        })
        builder.addCase(
            fetchPlants.fulfilled,
            (state, action: PayloadAction<Plant[]>) => {
                state.loading = false
                state.plants = action.payload
                state.error = ''
            }
        )
        builder.addCase(fetchPlants.rejected, (state, action) => {
            state.loading = false
            state.plants = []
            state.error = action.error.message || 'Something went wrong'
        })
    }
})

export default plantSlice.reducer
export const {setCurrentPlant} = plantSlice.actions
export const {setUploadPlant} = plantSlice.actions