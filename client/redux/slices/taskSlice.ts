import axios from 'axios'
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import moment from "moment/moment";

export type Task = {
    date: string;
    taskName: string;
    type: string;
}

export type UserPlant = {
    id: string;
    name: string;
    wateringFrequency: string;
    lastWatered: string;
    imageURL: string;
    imageFile: any;
};

type InitialState = {
    loading: boolean
    tasks: Task[]
    error: string
}
const initialState: InitialState = {
    loading: false,
    tasks: [],
    error: ''
}

export const fetchUserPlants = createAsyncThunk<Task[]>('fetchUserPlants', () => {
    return axios
        .get(`/plants/get`)
        .then(response => {
            const plants = response.data.map((plant: any): UserPlant => ({
                id: plant.plant_id,
                name: plant.plant_name,
                wateringFrequency: plant.watering_frequency,
                lastWatered: moment(plant.latest_watered).local().format('YYYY-MM-DD'),
                imageURL: plant.image_url,
                imageFile: plant.image_blob
            }));

            const tasks = plants.map((plant: UserPlant): Task => {
                const lastWatered = moment(plant.lastWatered);
                const wateringFrequency = plant.wateringFrequency;

                // Calculate next watering date depending on wateringFrequency
                let nextWateringDate = lastWatered.clone(); // Clone to avoid modifying the original moment object
                if (wateringFrequency === 'Every Day') {
                    nextWateringDate.add(1, 'days');
                } else if (wateringFrequency === 'every second day') {
                    nextWateringDate.add(2, 'days');
                } else if (wateringFrequency === 'weekly') {
                    nextWateringDate.add(1, 'weeks');
                } else if (wateringFrequency === 'monthly') {
                    nextWateringDate.add(1, 'months');
                }

                const today = moment();
                let type = '';

                if (nextWateringDate.isSame(today, 'day')) {
                    type = 'today';
                } else if (nextWateringDate.isBefore(today, 'day')) {
                    type = 'late';
                } else {
                    type = 'upcoming';
                }

                return {
                    date: nextWateringDate.format('YYYY-MM-DD'),
                    taskName: `Water ${plant.name}`,
                    type
                };
            });

            return tasks;
        });
});
// Fetch user plants thunk
export const fetchUserPlants = createAsyncThunk<Task[]>('fetchUserPlants', () => {
    return axios
        .get(`/plants/get`)
        .then(response => {
            const plants = response.data.map((plant: any): UserPlant => ({
                id: plant.plant_id,
                name: plant.plant_name,
                wateringFrequency: plant.watering_frequency,
                lastWatered: moment(plant.latest_watered).local().format('YYYY-MM-DD'),
                imageURL: plant.image_url,
                imageFile: plant.image_blob,
            }));

            const tasks = plants.map((plant: UserPlant): Task => {
                const lastWatered = moment(plant.lastWatered);
                const wateringFrequency = plant.wateringFrequency;

                // Calculate next watering date depending on wateringFrequency
                let nextWateringDate = lastWatered.clone(); // Clone to avoid modifying the original moment object
                if (wateringFrequency === 'Every Day') {
                    nextWateringDate.add(1, 'days');
                } else if (wateringFrequency === 'every second day') {
                    nextWateringDate.add(2, 'days');
                } else if (wateringFrequency === 'weekly') {
                    nextWateringDate.add(1, 'weeks');
                } else if (wateringFrequency === 'monthly') {
                    nextWateringDate.add(1, 'months');
                }

                const today = moment();
                let type = '';

                if (nextWateringDate.isSame(today, 'day')) {
                    type = 'today';
                } else if (nextWateringDate.isBefore(today, 'day')) {
                    type = 'late';
                } else {
                    type = 'upcoming';
                }

                return {
                    date: nextWateringDate.format('YYYY-MM-DD'),
                    taskName: `Water ${plant.name}`,
                    type,
                };
            });

            return tasks;
        });
});

// Add plant to profile thunk
export const addPlantToProfile = createAsyncThunk<boolean, UserPlant>(
    'plants/addPlantToProfile',
    async (plantData, {rejectWithValue}) => {
        const formData = new FormData();

        formData.append('plantName', plantData.name);
        formData.append('wateringFrequency', plantData.wateringFrequency);
        formData.append('lastWatered', plantData.lastWatered);
        formData.append('id', plantData.id);

        // Append image file or URL if available
        if (plantData.imageFile) {
            formData.append('imageFile', plantData.imageFile);
        } else if (plantData.imageURL) {
            formData.append('imageURL', plantData.imageURL);
        }

        try {
            const response = await fetch('/plants/add', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                console.log('Plant added successfully');
                return true; // Return true if the plant is added successfully
            } else {
                return rejectWithValue('Failed to add plant');
            }
        } catch (error: any) {
            console.error('Error adding plant:', error);
            return rejectWithValue(error.message || 'Error adding plant');
        }
    }
);

const userTaskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        // Fetch user plants cases
        builder.addCase(fetchUserPlants.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserPlants.fulfilled, (state, action: PayloadAction<Task[]>) => {
            state.loading = false;
            state.tasks = action.payload;
            state.error = null;
        });
        builder.addCase(fetchUserPlants.rejected, (state, action) => {
            state.loading = false;
            state.tasks = [];
            state.error = action.error.message || 'Something went wrong';
        });

        // Add plant to profile cases
        builder.addCase(addPlantToProfile.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addPlantToProfile.fulfilled, state => {
            state.loading = false;
            state.tasks = action.payload;
            state.error = null;
        });
        builder.addCase(addPlantToProfile.rejected, (state, action) => {
            state.loading = false;
            state.tasks = [];
            state.error = action.error.message || 'Something went wrong';
        });
    },
});

export default userTaskSlice.reducer;

export default userTaskSlice.reducer;