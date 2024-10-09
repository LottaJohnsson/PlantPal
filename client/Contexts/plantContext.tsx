import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';

export type Plant = {
    id: string; 
    name: string;
    wateringFrequency: string;
    lastWatered: string;
    imageURL: string; 
    imageFile: File | null; 
}

// task.name is 'water + plant name'
// task.type is 'today' if lastWatered+wateringFrequency is today
// task.type is 'ate' if lastWatered+wateringFrequency is before today
// task.type is 'upcoming' if lastWatered+wateringFrequency is after today
// task.date is lastWatered+wateringFrequency
export type Task = {
    date: string;
    taskName: string;
    type: string;
}

interface PlantContextProps {
    plants: Plant[];
    addPlantToProfile: (plantData: Plant) => Promise<boolean>; // Method to add a plant
    fetchPlants: () => Promise<Plant[]>; // Method to fetch plants from the database
    fetchTasks: () => Promise<Task[]>; // Method to fetch tasks from the database
}

const PlantContext = createContext<PlantContextProps | undefined>(undefined);

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    // Method to add a plant
    const addPlantToProfile = async (plantData: Plant): Promise<boolean> => { 
    
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
                console.log("Plant added successfully");
                return true;
            } else {
                console.log("Failed to add plant");
                return false;
            }
        } catch (error) {
            console.error("Error adding plant:", error);
            return false;
        }
    };

    // Method to fetch plants from the database
    const fetchPlants = async () => {
        console.log("Fetching plants");

        try {
            const response = await fetch('/plants/get');
            const data = await response.json();
            if (data.success) {
                const plantData = data.plants;

                // make array from plantData consiting of Plant objects
                const plants = plantData.map((plant: any) => {

                    return {
                        id: plant.plant_id,
                        name: plant.plant_name,
                        wateringFrequency: plant.watering_frequency,
                        lastWatered: moment(plant.latest_watered).local().format('YYYY-MM-DD'),
                        imageURL: plant.image_url,
                        imageFile: plant.image_blob
                    };
                });

                console.log("Plants fetched successfully", plants);

                return plants;

            } else {
                console.log("Failed to fetch plants");
            }
        } catch (error) {
            console.error("Error fetching plants:", error);
            return [];
        }
    }

    const fetchTasks = async () => {

        console.log("Fetching tasks");

        try {
            const response = await fetch('/plants/get');
            const data = await response.json();
            if (data.success) {
                const plantData = data.plants;

                // make array from plantData consiting of Plant objects
                const plants = plantData.map((plant: any) => {

                    return {
                        id: plant.plant_id,
                        name: plant.plant_name,
                        wateringFrequency: plant.watering_frequency,
                        lastWatered: moment(plant.latest_watered).local().format('YYYY-MM-DD'),
                        imageURL: plant.image_url,
                        imageFile: plant.image_blob
                    };
                });


                // make tasks array from plantData
                const tasks = plants.map((plant: Plant) => {

                    const lastWatered = moment(plant.lastWatered);
                    const wateringFrequency = plant.wateringFrequency;

                    // calculate next watering date depening on wateringFrequency
                    let nextWateringDate = lastWatered;

                    console.log("lastWatered", lastWatered.format('YYYY-MM-DD'));
                    console.log("wateringFrequency", wateringFrequency);
                    if (wateringFrequency === 'Every Day') {
                        nextWateringDate = lastWatered.add(1, 'days');
                        console.log("nextWateringDate should be on 8th??", nextWateringDate.format('YYYY-MM-DD'));
                    } else if (wateringFrequency === 'every second day') {
                        nextWateringDate = lastWatered.add(2, 'days');
                    } else if (wateringFrequency === 'weekly') {
                        nextWateringDate = lastWatered.add(1, 'weeks');
                    } else if (wateringFrequency === 'monthly') {
                        nextWateringDate = lastWatered.add(1, 'months');
                    }

                    const today = moment();

                    console.log("nextWateringDate", nextWateringDate.format('YYYY-MM-DD'));
                    console.log("today", today.format('YYYY-MM-DD'));
                    let type = '';

                    if (nextWateringDate.isSame(today, 'day')) {
                        type = 'today';
                    }
                    else if (nextWateringDate.isBefore(today, 'day')) {
                        type = 'late';
                    }
                    else {
                        type = 'upcoming';
                    }

                    return {
                        date: nextWateringDate.format('YYYY-MM-DD'),
                        taskName: `Water ${plant.name}`,
                        type
                    };
                });


                console.log("Tasks fetched successfully", tasks);

                setTasks(tasks);
                return tasks;

            } else {
                console.log("Failed to fetch tasks");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return [];
        }


    }

        


    return (
        <PlantContext.Provider value={{ plants, addPlantToProfile, fetchPlants, fetchTasks }}>
            {children}
        </PlantContext.Provider>
    );

};

export const usePlant = (): PlantContextProps => {
    const context = useContext(PlantContext);
    if (!context) {
        throw new Error('usePlant must be used within a PlantProvider');
    }
    return context;
};
