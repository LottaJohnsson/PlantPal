import axios from 'axios'
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import moment from "moment/moment";
import { add } from 'date-fns';

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
    userTasksToday: Task[]
    userTasksLate: Task[]
    userTasksUpcoming: Task[]
    userTasksDone: Task[]
    userPlants: UserPlant[]
    error: string | null
    success: string | null
}
const initialState: InitialState = {
    loading: false,
    userTasksToday: [],
    userTasksLate: [],
    userTasksUpcoming: [],
    userTasksDone: [],
    userPlants: [],
    error: null,
    success: null
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

// create task from one plant
const createTaskFromOnePlant = (plant: UserPlant): Task => {
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
}


// Fetch user plants 
export const fetchUserPlantsFromDB = createAsyncThunk<UserPlant[]>('fetchUserPlants', () => {
    console.log('Fetching user plants');
    return axios
        .get(`/plants/get`)
        .then(response => {
            
            const plants = response.data.plants.map((plant: any): UserPlant => ({
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
    async (plantData, {rejectWithValue, dispatch, getState}) => {

        console.log('Adding plant to database:', plantData,);

        const state = getState() as { task: InitialState }; // Access current state
        const userPlants = state.task.userPlants;

        // Check if the plant already exists in the state
        const plantExists = userPlants.some(
            (p) => p.name.toLowerCase() === plantData.name.toLowerCase()
        );

        if (plantExists) {
            return rejectWithValue('The plant name already exists in your profile, please choose a another name.');
        }

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
                    dispatch(addPlant(plantData));
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

            console.log('Adding plant to state:', action.payload);

            state.userPlants = [...state.userPlants, action.payload]
            state.error = null;
            // add task for the new plant
            const newTask = createTaskFromOnePlant(action.payload);
            if (newTask.type === 'today') {
                state.userTasksToday = [...state.userTasksToday, newTask];
            } else if (newTask.type === 'late') {
                state.userTasksLate = [...state.userTasksLate, newTask];
            } else {
                state.userTasksUpcoming = [...state.userTasksUpcoming, newTask];
            }

            addPlantsToDB(action.payload);
            
        },

        generateTasks: (state) => {
            console.log('Generating tasks');
            const tasks = createTasks(state.userPlants);  
            state.userTasksToday = tasks.filter((task) => task.type === 'today');
            state.userTasksLate = tasks.filter((task) => task.type === 'late');
            state.userTasksUpcoming = tasks.filter((task) => task.type === 'upcoming');
            state.userTasksDone = tasks.filter((task) => task.type === 'done');
        },

        updateTask: (state, action: PayloadAction<Task>) => {
            const task = action.payload;
            
            // find the task in the correct array and update it, check by looking at the taskName
            const todayIndex = state.userTasksToday.findIndex((t) => t.taskName === task.taskName);
            const lateIndex = state.userTasksLate.findIndex((t) => t.taskName === task.taskName);
            const upcomingIndex = state.userTasksUpcoming.findIndex((t) => t.taskName === task.taskName);
            const doneIndex = state.userTasksDone.findIndex((t) => t.taskName === task.taskName);

            // update the task and check if it has changed type, if so move it to the correct array and remove it from the old one
            // TODO make this code nicer :)
            if (todayIndex !== -1) {
                state.userTasksToday[todayIndex] = task;
                if (task.type === 'late') {
                    state.userTasksLate = [...state.userTasksLate, task];
                    state.userTasksToday = state.userTasksToday.filter((t) => t.taskName !== task.taskName); 
                } else if (task.type === 'upcoming') {
                    state.userTasksUpcoming = [...state.userTasksUpcoming, task];
                    state.userTasksToday = state.userTasksToday.filter((t) => t.taskName !== task.taskName);
                } else if (task.type === 'done') {
                    state.userTasksDone = [...state.userTasksDone, task];
                    state.userTasksToday = state.userTasksToday.filter((t) => t.taskName !== task.taskName);
                }
            } else if (lateIndex !== -1) {
                state.userTasksLate[lateIndex] = task;
                if (task.type === 'today') {
                    state.userTasksToday = [...state.userTasksToday, task];
                    state.userTasksLate = state.userTasksLate.filter((t) => t.taskName !== task.taskName);
                } else if (task.type === 'upcoming') {
                    state.userTasksUpcoming = [...state.userTasksUpcoming, task];
                    state.userTasksLate = state.userTasksLate.filter((t) => t.taskName !== task.taskName);
                } else if (task.type === 'done') {
                    state.userTasksDone = [...state.userTasksDone, task];
                    state.userTasksLate = state.userTasksLate.filter((t) => t.taskName !== task.taskName);
                }
            } else if (upcomingIndex !== -1) {
                state.userTasksUpcoming[upcomingIndex] = task;
                if (task.type === 'today') {
                    state.userTasksToday = [...state.userTasksToday, task];
                    state.userTasksUpcoming = state.userTasksUpcoming.filter((t) => t.taskName !== task.taskName);
                } else if (task.type === 'late') {
                    state.userTasksLate = [...state.userTasksLate, task];
                    state.userTasksUpcoming = state.userTasksUpcoming.filter((t) => t.taskName !== task.taskName);
                } else if (task.type === 'done') {
                    state.userTasksDone = [...state.userTasksDone, task];
                    state.userTasksUpcoming = state.userTasksUpcoming.filter((t) => t.taskName !== task.taskName);
                }
            } else if (doneIndex !== -1) {
                state.userTasksDone[doneIndex] = task;
                if (task.type === 'today') {
                    state.userTasksToday = [...state.userTasksToday, task];
                    state.userTasksDone = state.userTasksDone.filter((t) => t.taskName !== task.taskName);
                } else if (task.type === 'late') {
                    state.userTasksLate = [...state.userTasksLate, task];
                    state.userTasksDone = state.userTasksDone.filter((t) => t.taskName !== task.taskName);
                } else if (task.type === 'upcoming') {
                    state.userTasksUpcoming = [...state.userTasksUpcoming, task];
                    state.userTasksDone = state.userTasksDone.filter((t) => t.taskName !== task.taskName);
                }
            }

        }
    },
    extraReducers: builder => {
        // Fetch user plants cases
        builder.addCase(fetchUserPlantsFromDB.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserPlantsFromDB.fulfilled, (state, action: PayloadAction<UserPlant[]>) => {
            state.loading = false;
            state.userPlants = action.payload;
            state.error = null;
        });
        builder.addCase(fetchUserPlantsFromDB.rejected, (state, action) => {
            state.loading = false;
            state.userPlants = [];
            state.error = action.error.message || 'Something went wrong';
        });

        // Add plant to profile cases
        builder.addCase(addPlantsToDB.pending, state => {
            state.loading = true;
            state.error = null;
            state.success = null;
        });
        builder.addCase(addPlantsToDB.fulfilled, state => {
            state.loading = false;
            state.error = null;
            state.success = 'Plant added successfully!';
        });
        builder.addCase(addPlantsToDB.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Failed to add plant';
            state.success = null;
        });
    },
});

export default userTaskSlice.reducer;
export const {addPlant, generateTasks, updateTask} = userTaskSlice.actions;



