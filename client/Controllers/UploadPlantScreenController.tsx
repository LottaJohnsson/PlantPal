import React, { useState, useEffect } from 'react';
import UploadPlantScreenView from '../Views/uploadPlantScreenView';
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {addPlantsToDB, addPlant} from '../redux/slices/userSlice'
import {setUploadPlant} from '../redux/slices/plantSlice'
import {UserPlant} from '../redux/slices/userSlice'
import { useDropzone } from 'react-dropzone';

type Props = {};

export default function UploadPlantScreenController({}: Props) {
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
    const [usingDefaultImage, setUsingDefaultImage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const selectedPlant = useAppSelector(state => state.plant.uploadPlant);
    const errorUserSlice = useAppSelector(state => state.task.error);
    const successUserSlice = useAppSelector(state => state.task.success);

    useEffect(() => {
        
        if (errorUserSlice) {
            setErrorMessage(errorUserSlice); 
        }
        if (successUserSlice) {
            setSuccessMessage(successUserSlice);
        }
    }, [errorUserSlice, successUserSlice]);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
            setFormData({ ...formData, imageURL: '', imageFile: file });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    
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
        //setIsPlantSelected(false);
        setFormVisible(false);
        if (query.length > 2) {
            setLoading(true);
            try {
                const response = await fetch(`plants/search?query=${encodeURIComponent(query)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const json = await response.json();
                setSearchResult(json.result.slice(0,5));
    
            } catch (error) {
                console.error("Error during search:", error);
                setSearchResult([]);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResult([]);
            setLoading(false);
        }
    };

    // function to handle selecting a plant after searching
    const handleSelectPlant = (plant: any) => {
        setFormVisible(true);
        if (plant.id) {
            setSelectedApiPlantId(plant.id);
            //setSelectedPlant(plant); // Store the selected plant details 
            setFormData({
                id: plant.id,
                name: plant.common_name || plant.scientific_name || '',
                lastWatered: '',
                wateringFrequency: mapWateringFrequency(plant.watering),
                imageURL: plant.default_image.small_url || '',
                imageFile: null,
            });
            //setIsPlantSelected(true);
            dispatch(setUploadPlant(plant));
        } else {
            setSelectedApiPlantId(null);
            //setSelectedPlant(null); // Reset selected plant
            setFormData({
                id: '',
                name: '',
                lastWatered: '',
                wateringFrequency: '',
                imageURL: '',
                imageFile: null,
            });
            //setIsPlantSelected(false);
            dispatch(setUploadPlant(null));
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


    // TODO fix loading in redux
    // function to add plant using redux
    const onAddPlant = async (): Promise<void> => {

        // Clear previous messages
        setErrorMessage(null);
        setSuccessMessage(null);
    
        // Validate the form before adding the plant
        if (!isFormValid()) {
            setErrorMessage("You need to fill in everything to add the plant!");
            return;
        }
    
        const plantData: UserPlant = {
            id: formData.id,
            name: formData.name,
            lastWatered: formData.lastWatered,
            wateringFrequency: formData.wateringFrequency,
            imageURL: formData.imageURL,
            imageFile: formData.imageFile,
        };

        // Add the plant to db and get the action result
        await dispatch(addPlantsToDB(plantData));
        
    };


    // Validation function to check if all fields are filled
    const isFormValid = () => {
        return (
            (image !== null || usingDefaultImage) &&
            formData.name.trim() !== '' &&
            formData.lastWatered.trim() !== '' &&
            formData.wateringFrequency.trim() !== ''
        );
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
            //isPlantSelected={isPlantSelected}
            handleRemoveImage={handleRemoveImage}
            handleUseDefaultImage={handleUseDefaultImage}
            usingDefaultImage={usingDefaultImage}
            errorMessage={errorMessage}
            successMessage={successMessage}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
        />
    );
}
