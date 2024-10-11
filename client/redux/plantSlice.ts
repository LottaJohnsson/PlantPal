import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type Plant = {
    id: number;
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


type InitialState = {
    loading: boolean
    plants: Plant[]
    error: string
  }
  const initialState: InitialState = {
    loading: false,
    plants: [],
    error: ''
  }
  
  // Generates pending, fulfilled and rejected action types
  export const fetchPlants = createAsyncThunk('fetchUsers', (query: string) => {
    console.log('fetching plants');
    return axios
      .get(`plants/search?query=${encodeURIComponent(query)}`)
      .then(response => response.data.result)
  })
  
  const plantSlice = createSlice({
    name: 'plant',
    initialState,
    reducers: {},
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