import moment from 'moment';
/*
// Define the Plant model type
export type Plant = {
    id: string;
    name: string;
    wateringFrequency: string;
    lastWatered: string;
    imageURL: string;
    imageFile: File | null;
};

// Define the Task model type
export type Task = {
    date: string;
    taskName: string;
    type: 'today' | 'late' | 'upcoming' | 'done';
};

export class PlantModel {
    // Class properties to store plants and tasks
    private plants: Plant[] = [];
    private tasks: Task[] = [];
    private currentPlant: any;
    private currentCareAdvice: any;

    async constructor() {
        this.plants = await this.fetchPlants();
        this.tasks = this.createTasks(this.plants);
    }


    SetCurrentPlant(currentPlant: any){
        
    }


    // Method to add a plant to the profile
    async addPlantToProfile(plantData: Plant): Promise<boolean> {
        const formData = new FormData();

        formData.append('plantName', plantData.name);
        formData.append('wateringFrequency', plantData.wateringFrequency);
        formData.append('lastWatered', plantData.lastWatered);
        formData.append('id', plantData.id);

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
                this.plants.push(plantData);  // Update the local state
                return true;
            } else {
                console.log('Failed to add plant');
                return false;
            }
        } catch (error) {
            console.error('Error adding plant:', error);
            return false;
        }
    }

    // Method to fetch plants from the database
    async fetchPlants(): Promise<Plant[]> {
        console.log('Fetching plants');
        try {
            const response = await fetch('/plants/get');
            const data = await response.json();
            if (data.success) {
                const plantData = data.plants;

                // Create an array of Plant objects
                const plants = plantData.map((plant: any) => ({
                    id: plant.plant_id,
                    name: plant.plant_name,
                    wateringFrequency: plant.watering_frequency,
                    lastWatered: moment(plant.latest_watered).local().format('YYYY-MM-DD'),
                    imageURL: plant.image_url,
                    imageFile: plant.image_blob,
                }));

                console.log('Plants fetched successfully', plants);
                this.plants = plants;  // Update the local state
                return plants;
            } else {
                console.log('Failed to fetch plants');
                return [];
            }
        } catch (error) {
            console.error('Error fetching plants:', error);
            return [];
        }
    }

    // Method to fetch tasks based on the plants
    createTasks(plants): Task[] {
        console.log('Fetching tasks');

            const tasks = plants.map((plant: Plant) => {
                const lastWatered = moment(plant.lastWatered);
                let nextWateringDate = lastWatered.clone();

                if (plant.wateringFrequency === 'Every Day') {
                    nextWateringDate.add(1, 'days');
                } else if (plant.wateringFrequency === 'every second day') {
                    nextWateringDate.add(2, 'days');
                } else if (plant.wateringFrequency === 'weekly') {
                    nextWateringDate.add(1, 'weeks');
                } else if (plant.wateringFrequency === 'monthly') {
                    nextWateringDate.add(1, 'months');
                }

                const today = moment();
                let type: 'today' | 'late' | 'upcoming';

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

    }

    // Optional: Expose getter methods to access the plant and task lists
    getPlants(): Plant[] {
        return this.plants;
    }

    getTasks(): Task[] {
        return this.tasks;
    }
}
*/