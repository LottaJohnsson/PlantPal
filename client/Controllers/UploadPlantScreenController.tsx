import React, { useState } from 'react';
import UploadPlantScreenView from '../Views/uploadPlantScreenView';
import { searchSpecies } from "../../server/Models/plantModel";
import { usePlant, Plant } from '../Contexts/plantContext'; 

type Props = {};

export default function UploadPlantScreenController({}: Props) {
    const { addPlantToProfile } = usePlant(); 
    const [isPlantSelected, setIsPlantSelected] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        lastWatered: '',
        wateringFrequency: '',
        imageURL: '',
        imageFile: null as File | null,
    });
    const [selectedApiPlantId, setSelectedApiPlantId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [selectedPlant, setSelectedPlant] = useState<any>(null);
    const [usingDefaultImage, setUsingDefaultImage] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
            setFormData({ ...formData, imageURL: '', imageFile: file });
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImage(null);
        setUsingDefaultImage(false);
        setFormData({ ...formData, imageURL: '', imageFile: null }); 
    };

    const handleUseDefaultImage = () => {
        setUsingDefaultImage(true);
        if (selectedPlant) {
            const defaultImageUrl = selectedPlant.default_image?.original_url;

            if (defaultImageUrl) {
                setFormData({ ...formData, imageURL: defaultImageUrl });
                setImageFile(null);
                setImage(defaultImageUrl);
            }
        } else {
            console.log('No plant selected to use default image.');
        }
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsPlantSelected(false);
        setFormVisible(false);
        if (query.length > 2) {
            setLoading(true);
            try {
                const result = await searchSpecies(query);
                setSearchResult(result.slice(0, 5));
            } catch (error) {
                console.error('Error fetching plant data:', error);
                setSearchResult([]);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResult([]);
            setLoading(false);
        }
    };

    const handleSelectPlant = (plant: any) => {
        setFormVisible(true);
        if (plant.id) {
            setSelectedApiPlantId(plant.id);
            setSelectedPlant(plant); // Store the selected plant details 
            setFormData({
                id: plant.id,
                name: plant.common_name || plant.scientific_name || '',
                lastWatered: '',
                wateringFrequency: mapWateringFrequency(plant.watering),
                imageURL: plant.default_image.small_url || '',
                imageFile: null,
            });
            setIsPlantSelected(true);
        } else {
            setSelectedApiPlantId(null);
            setSelectedPlant(null); // Reset selected plant
            setFormData({
                id: '',
                name: '',
                lastWatered: '',
                wateringFrequency: '',
                imageURL: '',
                imageFile: null,
            });
            setIsPlantSelected(false);
        }
        setSearchResult([]);
    };

    const mapWateringFrequency = (frequency: string) => {
        switch (frequency) {
            case 'Frequent':
                return 'every second day'; 
            case 'Average':
                return 'weekly'; 
            case 'Minimum':
                return 'monthly';
            case 'None':
                return 'none'; 
            default:
                return ''; 
        }
    };

    const onAddPlant = async (plantData: Plant) => {
        const success = await addPlantToProfile(plantData);
        if (success) {
            console.log("Plant added successfully");
        } else {
            console.log("Failed to add plant");
        }
        return success;
    };

    const isDragActive = image !== null;

    return (
        <UploadPlantScreenView
            image={imageFile}
            searchQuery={searchQuery}
            searchResult={searchResult}
            loading={loading}
            formVisible={formVisible}
            formData={formData}
            handleSearchChange={handleSearchChange}
            handleSelectPlant={handleSelectPlant}
            handleChange={handleChange}
            onDrop={onDrop}
            isDragActive={isDragActive}
            onAddPlant={onAddPlant}
            selectedApiPlantId={selectedApiPlantId}
            isPlantSelected={isPlantSelected}
            handleRemoveImage={handleRemoveImage}
            handleUseDefaultImage={handleUseDefaultImage}
            usingDefaultImage={usingDefaultImage}
        />
    );
}
