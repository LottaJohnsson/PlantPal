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
    userTasks: Task[]
    userPlants: UserPlant[]
    error: string
}
const initialState: InitialState = {
    loading: false,
    userTasks: [],
    userPlants: [],
    error: ''
}

// create tasks from user plants
const createTasks = (plants: UserPlant[]): Task[] => {
    return plants.map((plant: UserPlant): Task => {
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
}

// Fetch user plants 
export const fetchUserPlantsFromDB = createAsyncThunk<UserPlant[]>('fetchUserPlants', () => {
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

            return plants;
        });
});


// Add plant to profile thunk
export const addPlantsToDB = createAsyncThunk<boolean, UserPlant>(
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


        return axios
            .post(`/plants/add`, formData)
            .then(response => {
                if (response.data.success) {
                    return true;
                } else {
                    return rejectWithValue('Failed to add plant');
                }
            })
            .catch(error => {
                console.error('Error adding plant:', error);
                return rejectWithValue(error.message || 'Error adding plant');
            });
    }
);

const userTaskSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addPlant: (state, action: PayloadAction<UserPlant>) => {
            state.userPlants = [...state.userPlants, action.payload]
            state.userTasks = createTasks(state.userPlants);
        },

        createTasks: (state) => {
           state.userTasks = createTasks(state.userPlants);  
        }
    },
    extraReducers: builder => {
        // Fetch user plants cases
        builder.addCase(fetchUserPlantsFromDB.pending, state => {
            state.loading = true;
            state.error = '';
        });
        builder.addCase(fetchUserPlantsFromDB.fulfilled, (state, action: PayloadAction<UserPlant[]>) => {
            state.loading = false;
            state.userPlants = action.payload;
            state.error = '';
        });
        builder.addCase(fetchUserPlantsFromDB.rejected, (state, action) => {
            state.loading = false;
            state.userPlants = [];
            state.error = action.error.message || 'Something went wrong';
        });

        // Add plant to profile cases
        builder.addCase(addPlantsToDB.pending, state => {
            state.loading = true;
            state.error = '';
        });
        builder.addCase(addPlantsToDB.fulfilled, state => {
            state.loading = false;
            state.error = '';
        });
        builder.addCase(addPlantsToDB.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Something went wrong';
        });
    },
});

export default userTaskSlice.reducer;

