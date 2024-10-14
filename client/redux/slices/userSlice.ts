import axios from 'axios'
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import moment from "moment/moment";

export type Task = {
    date: string;
    taskName: string;
    plantName: string;
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
    return plants.flatMap((plant: UserPlant): Task[] => {
        console.log('createTasks:');
        const lastWatered = moment(plant.lastWatered);
        const wateringFrequency = plant.wateringFrequency;
        const today = moment();
        let nextWateringDate = lastWatered.clone(); 
        let tasks: Task[] = [];

        // Create a "done" task if last watered is today
        if (lastWatered.isSame(today, 'day')) {
            console.log('lastWatered is today', plant);
            tasks.push({
                date: today.format('YYYY-MM-DD'),
                taskName: `Water ${plant.name}`,
                plantName: plant.name,
                type: 'done'
            });
        }

        // Calculate next watering date depending on wateringFrequency
        if (wateringFrequency === 'Every Day') {
            nextWateringDate.add(1, 'days');
        } else if (wateringFrequency === 'every second day') {
            nextWateringDate.add(2, 'days');
        } else if (wateringFrequency === 'weekly') {
            nextWateringDate.add(1, 'weeks');
        } else if (wateringFrequency === 'monthly') {
            nextWateringDate.add(1, 'months');
        }

        // Determine the type of the upcoming task
        let taskType = '';
        if (nextWateringDate.isSame(today, 'day')) {
            taskType = 'today';
        } else if (nextWateringDate.isBefore(today, 'day')) {
            taskType = 'late';
        } else if (nextWateringDate.isAfter(today, 'day')) {
            taskType = 'upcoming';
        }

        // Create the upcoming task
        tasks.push({
            date: nextWateringDate.format('YYYY-MM-DD'),
            taskName: `Water ${plant.name}`,
            plantName: plant.name,
            type: taskType
        });

        return tasks; // Return both "done" and "upcoming" tasks
    });
};

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
        plantName: plant.name,
        type
    };
}


// Fetch user plants 
export const fetchUserPlantsFromDB = createAsyncThunk<UserPlant[]>('fetchUserPlants', () => {
    return axios
        .get(`/plants/get`)
        .then(response => {
            
            const plants = response.data.plants.map((plant: any): UserPlant => ({
                id: plant.plant_id,
                name: plant.plant_name,
                wateringFrequency: plant.watering_frequency,
                lastWatered: moment(plant.latest_watered).local().format('YYYY-MM-DD'),
                imageURL: plant.image_url,
                imageFile: `data:image/jpg;base64,${plant.image_blob}`,
            }));

            console.log('Fetched user plants:', plants);
            return plants;
        });

    
});


// Add plant to database
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

// Update plant in database
export const updatePlantInDB = createAsyncThunk<boolean, string>(
    'plants/updatePlantInProfile',
    async (plantName, { rejectWithValue, dispatch, getState }) => {
        // Find the plant in the state
        const state = getState() as { task: InitialState };
        const userPlants = state.task.userPlants;
        const plantData = userPlants.find((p) => p.name === plantName);

        if (!plantData) {
            return rejectWithValue('The plant does not exist in your profile.');
        }

        console.log('Updating plant in database:', plantData);

        // Send plant name and lastWatered date to server as JSON
        const payload = {
            plantName: plantData.name,
            lastWatered: moment().format('YYYY-MM-DD'),
        };

        return axios
            .post(`/plants/update`, payload, {
                headers: {
                    'Content-Type': 'application/json', 
                },
            })
            .then(response => {
                if (response.data.success) {
                    return true;
                } else {
                    return rejectWithValue('Failed to update plant');
                }
            })
            .catch(error => {
                console.error('Error updating plant:', error);
                return rejectWithValue(error.message || 'Error updating plant');
            });
    }
);



// remove plant from database
export const removePlantFromDB = createAsyncThunk<boolean, string>(
    'plants/removePlantFromProfile',
    async (plantName, {rejectWithValue, dispatch, getState}) => {

        console.log('Removing plant from database:', plantName);

        return axios
            .delete(`/plants/delete`, {data: {plantName}})
            .then(response => {
                if (response.data.success) {
                    return true;
                } else {
                    return rejectWithValue('Failed to remove plant');
                }
            })
            .catch(error => {
                console.error('Error removing plant:', error);
                return rejectWithValue(error.message || 'Error removing plant');
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
            // add task for the new plant
            const newTask = createTaskFromOnePlant(action.payload);
            if (newTask.type === 'today') {
                state.userTasksToday = [...state.userTasksToday, newTask];
            } else if (newTask.type === 'late') {
                state.userTasksLate = [...state.userTasksLate, newTask];
            } else {
                state.userTasksUpcoming = [...state.userTasksUpcoming, newTask];
            }
            
        },

        generateTasks: (state) => {
            console.log('Generating tasks');
            const tasks = createTasks(state.userPlants);  
            state.userTasksToday = tasks.filter((task) => task.type === 'today');
            state.userTasksLate = tasks.filter((task) => task.type === 'late');
            state.userTasksUpcoming = tasks.filter((task) => task.type === 'upcoming');
            state.userTasksDone = tasks.filter((task) => task.type === 'done');
        },

        completeTask: (state, action: PayloadAction<Task>) => {
            let task = action.payload;
        
            console.log('Completing task:', task);
        
            // Find the task in the correct array and remove it
            const todayIndex = state.userTasksToday.findIndex((t) => t.taskName === task.taskName);
            const lateIndex = state.userTasksLate.findIndex((t) => t.taskName === task.taskName);
            const upcomingIndex = state.userTasksUpcoming.findIndex((t) => t.taskName === task.taskName);
        
            console.log('Indexes:', todayIndex, lateIndex, upcomingIndex);
        
            if (todayIndex !== -1) {
                state.userTasksToday = state.userTasksToday.filter((t) => t.taskName !== task.taskName);
            } else if (lateIndex !== -1) {
                state.userTasksLate = state.userTasksLate.filter((t) => t.taskName !== task.taskName);
            } else if (upcomingIndex !== -1) {
                state.userTasksUpcoming = state.userTasksUpcoming.filter((t) => t.taskName !== task.taskName);
            }
        
            // Check if the task already exists in the done array
            const doneIndex = state.userTasksDone.findIndex((t) => t.taskName === task.taskName);
            if (doneIndex !== -1) {
                return;
            }
        
            // Make a shallow copy of the task and modify the date
            const updatedTask = { ...task, date: moment().format('YYYY-MM-DD') };
            state.userTasksDone = [...state.userTasksDone, updatedTask];
        
            // Update plant state with the new lastWatered date
            const plantIndex = state.userPlants.findIndex((p) => p.name === task.plantName);
            if (plantIndex !== -1) {
                state.userPlants[plantIndex].lastWatered = moment().format('YYYY-MM-DD');
            }
        },
        
        // Action to update error and success messages	
        updateMessages: (state, action: PayloadAction<{ error: string }>) => {
            state.error = action.payload.error;
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
export const {addPlant, generateTasks, completeTask, updateMessages} = userTaskSlice.actions;



