import React, { createContext, useContext, useState, useEffect } from 'react';

export type Plant = {
    id: string; 
    name: string;
    wateringFrequency: string;
    lastWatered: string;
    imageURL: string; 
    imageFile: File | null; 
}

interface PlantContextProps {
    plants: Plant[];
    addPlantToProfile: (plantData: Plant) => Promise<boolean>; // Method to add a plant
    fetchPlants: () => Promise<Plant[]>; // Method to fetch plants from the database
}

const PlantContext = createContext<PlantContextProps | undefined>(undefined);

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [plants, setPlants] = useState<Plant[]>([]);

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
                        lastWatered: plant.latest_watered,
                        imageURL: plant.image_url,
                        imageFile: plant.image_blob ? new File([plant.image_blob], plant.plant_name) : null,
                    };
                });

                console.log("Plants fetched successfully", data.plants);

                return plants;

            } else {
                console.log("Failed to fetch plants");
            }
        } catch (error) {
            console.error("Error fetching plants:", error);
            return [];
        }
    }

    return (
        <PlantContext.Provider value={{ plants, addPlantToProfile, fetchPlants }}>
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
