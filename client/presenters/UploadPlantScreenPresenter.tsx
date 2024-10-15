import React, {useState, useEffect} from 'react'
import UploadPlantScreenView from '../views/UploadPlantScreenView'
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {addPlantsToDB, updateMessages} from '../redux/slices/userSlice'
import {setUploadPlant} from '../redux/slices/plantSlice'
import {UserPlant} from '../redux/slices/userSlice'
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import Popup from "../components/PopUp";
import { unwrapResult } from '@reduxjs/toolkit';



type Props = {};

export default function UploadPlantScreenPresenter({}: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        api_name: '',
        lastWatered: '',
        wateringFrequency: '',
        imageURL: '',
        imageFile: null as File | null,
    });
    const [selectedApiPlantId, setSelectedApiPlantId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [usingDefaultImage, setUsingDefaultImage] = useState(false);
    const dispatch = useAppDispatch();
    const selectedPlant = useAppSelector(state => state.plant.uploadPlant);
    const errorUserSlice = useAppSelector(state => state.task.error);
    const successUserSlice = useAppSelector(state => state.task.success);
    const [openPopUp, setOpenPopUp] = useState(false)
    const [popupMessage, setPopUpMessage] = useState<string>('')
    const [popupHeader, setPopUpHeader] = useState<string>('')

    useEffect(() => {
        if (selectedPlant) {
            handleSelectPlant(selectedPlant);
        }
    }, [selectedPlant]);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
            setFormData({...formData, imageURL: '', imageFile: file});
        }
    };

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImage(null);
        setUsingDefaultImage(false);
        setFormData({...formData, imageURL: '', imageFile: null});
    };

    const handleUseDefaultImage = () => {
        setUsingDefaultImage(true);
        if (selectedPlant) {
            const defaultImageUrl = selectedPlant.default_image?.original_url;

            if (defaultImageUrl) {
                setFormData({...formData, imageURL: defaultImageUrl});
                setImageFile(null);
                setImage(defaultImageUrl);
            }
        }
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setFormVisible(false);
        if (query.length > 2) {
            setLoading(true);
            try {
                const response = await axios.get(`plants/search?query=${encodeURIComponent(query)}`);
                // check so search result exists before setting it
                if (response.data.data) {
                    setSearchResult(response.data.data.slice(0, 5));
                } else {
                    setSearchResult([]);
                }

            } catch (error: any) {
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

            // checks for plant details
            const imageUrl = plant.default_image?.small_url || '';
            const plantName = plant.common_name || plant.scientific_name || '';
            const wateringFrequency = mapWateringFrequency(plant.watering);
            const apiPlantName = plant.common_name || plant.scientific_name || '';

            setFormData({
                id: plant.id,
                name: plantName,
                api_name: apiPlantName,
                lastWatered: '',
                wateringFrequency: wateringFrequency,
                imageURL: imageUrl,
                imageFile: null,
            });
            dispatch(setUploadPlant(plant));
        } else {
            setSelectedApiPlantId(null);
            setFormData({
                id: '',
                name: '',
                api_name: '',
                lastWatered: '',
                wateringFrequency: '',
                imageURL: '',
                imageFile: null,
            });
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

    const onAddPlant = async (): Promise<void> => {

        // Validate the form before adding the plant
        if (!isFormValid()) {
            dispatch(updateMessages({error: "You need to fill in everything to add the plant!"}));
            return;
        }

        const plantData: UserPlant = {
            id: formData.id,
            name: formData.name,
            api_name: formData.api_name,
            lastWatered: formData.lastWatered,
            wateringFrequency: formData.wateringFrequency,
            imageURL: formData.imageURL,
            imageFile: formData.imageFile,
        };

        try {
            // Dispatch the action and unwrap the result to catch any errors
            const resultAction = await dispatch(addPlantsToDB(plantData));
            const result = unwrapResult(resultAction);

            // If successful, show the popup
            setPopUpMessage("You have successfully added the plant to your profile!");
            setPopUpHeader("Added plant")
            setOpenPopUp(true);
            
            // set selected plant to null
            dispatch(setUploadPlant(null));

        } catch (error) {
            // If there's an error, dispatch the appropriate error message
            console.log('Error adding plant:', error);
        }
    };

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
        <>
            <UploadPlantScreenView
                image={imageFile}
                searchQuery={searchQuery}
                searchResult={searchResult}
                loading={loading}
                formVisible={formVisible}
                formData={formData}
                handleSearchChange={handleSearchChange}
                handleSelectPlant={handleSelectPlant}
                handleFormChange={handleFormChange}
                onDrop={onDrop}
                isDragActive={isDragActive}
                onAddPlant={onAddPlant}
                selectedApiPlantId={selectedApiPlantId}
                handleRemoveImage={handleRemoveImage}
                handleUseDefaultImage={handleUseDefaultImage}
                usingDefaultImage={usingDefaultImage}
                errorMessage={errorUserSlice}
                successMessage={successUserSlice}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                selectedPlant={selectedPlant}
            />
            <Popup.PopUp open={openPopUp} message={popupMessage} header={popupHeader}
            handleClose={() => setOpenPopUp(false)}></Popup.PopUp>
        </>
    );
}
