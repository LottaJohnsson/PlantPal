import React, { useState } from 'react';
import { Typography, Box, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { format } from 'date-fns'; 
import { useDropzone } from 'react-dropzone';
import { Plant } from '../Contexts/plantContext';

type Props = {
    image: File | null;
    searchQuery: string;
    searchResult: any[];
    loading: boolean;
    formVisible: boolean;
    formData: Plant;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectPlant: (plant: any) => void; 
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (acceptedFiles: File[]) => void;
    isDragActive: boolean;
    onAddPlant: (plantData: Plant) => Promise<boolean>; 
    selectedApiPlantId: string | null; 
    isPlantSelected: boolean; 
    handleRemoveImage: () => void;
    handleUseDefaultImage: () => void;
};

export default function UploadPlantScreenView({
    image,
    searchQuery,
    searchResult,
    loading,
    formVisible,
    formData,
    handleSearchChange,
    handleSelectPlant,
    handleChange,
    onDrop,
    isDragActive,
    onAddPlant,
    selectedApiPlantId,
    isPlantSelected,
    handleRemoveImage,
    handleUseDefaultImage,
}: Props) {
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    
    // State to manage errorand success message
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [usingDefaultImage, setUsingDefaultImage] = useState(false);

    // Validation function to check if all fields are filled
    const isFormValid = () => {
        return (
            (image !== null || usingDefaultImage) && // Check if an image is selected
            formData.name.trim() !== '' && // Check if plant name is filled
            formData.lastWatered.trim() !== '' && // Check if last watered date is filled
            formData.wateringFrequency.trim() !== '' // Check if watering frequency is selected
        );
    };

    const handleAddPlant = async () => {
        if (!isFormValid()) {
            setErrorMessage("You need to fill in everything to add the plant!"); // Set error message if validation fails
            setSuccessMessage(null);
            return; // Stop execution if form is invalid
        }
        
        const plantData: Plant = {
            id: formData.id,
            name: formData.name,
            lastWatered: formData.lastWatered,
            wateringFrequency: formData.wateringFrequency,
            imageURL: formData.imageURL,
            imageFile: formData.imageFile,
        };

        const success = await onAddPlant(plantData);
        if (success) {
            setErrorMessage(null); // Clear error message on success
            setSuccessMessage("Plant added successfully!"); // Set success message
        }
        
    };

    const handleUseDefaultImageWrapper = () => {
        handleUseDefaultImage();
        setUsingDefaultImage(true); 
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                textAlign: 'center',
                minHeight: '30vh',
                marginTop: '32px',
            }}
        >
            <Typography variant="h2" sx={{ color: 'primary.dark', marginBottom: '16px' }}>
                Add a New Plant
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: 'black',
                    fontSize: '1.2rem',
                    marginBottom: '32px',
                    maxWidth: '90vh',
                    backgroundColor: 'white',
                }}
            >
                Add a new plant to your collection! Search for a plant or add it manually if you can't find it.
            </Typography>

            {/* Search bar */}
            <TextField
                label="Search for a plant"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ marginBottom: '16px', maxWidth: '600px' }}
            />

            {/* Loading spinner while searching */}
            {loading && <CircularProgress sx={{ marginBottom: '16px', color: 'secondary.dark' }} />}

            {/* Search results */}
            {searchResult.length > 0 ? (
                <Box sx={{ marginBottom: '16px', width: '100%', maxWidth: '600px' }}>
                    {searchResult.map((plant: any) => (
                        <Box key={plant.id} sx={{ 
                            marginBottom: '16px', 
                            marginTop: '16px',
                            borderRadius: '8px',
                            padding: '16px',
                            backgroundColor: 'info.main',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h5">{plant.common_name || plant.scientific_name}</Typography>
                            {plant.default_image?.original_url && (
                                <img
                                    src={plant.default_image.original_url}
                                    alt={plant.common_name || plant.scientific_name}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px', marginTop: '8px', border: 'px solid #B41878' }}
                                />
                            )}
                            <Button
                                variant="contained"
                                onClick={() => handleSelectPlant(plant)}
                                sx={{
                                    backgroundColor: 'secondary.light',
                                    color: 'secondary.dark',
                                    margin: '8px',
                                    '&:hover': {
                                        backgroundColor: 'secondary.dark',
                                        color: 'secondary.light',
                                    },
                                }}
                            >
                                Use this plant
                            </Button>
                        </Box>
                    ))}
                </Box>
            ) : (
                searchResult.length === 0 && !isPlantSelected && searchQuery && !loading && (
                    <Box sx={{ marginBottom: '16px' }}>
                        <Typography variant="body1">
                            Sorry, we don't recognize that plant...please add it manually!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => handleSelectPlant({})} 
                            sx={{
                                backgroundColor: 'secondary.light',
                                color: 'secondary.dark',
                                margin: '8px',
                                '&:hover': {
                                    backgroundColor: 'secondary.dark',
                                    color: 'secondary.light',
                                },
                            }}
                        >
                            Add plant manually
                        </Button>
                    </Box>
                )
            )}


            {/* Form when a plant is selected */}
            {formVisible && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '600px',
                        padding: '16px',
                        borderRadius: '8px',
                        backgroundColor: 'main.light',
                        boxShadow: 2,
                    }}
                >
                    {/* File Upload with default image option if plant is found in the API */}
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed #e0e0e0',
                            borderRadius: '8px',
                            padding: '16px',
                            width: '100%',
                            textAlign: 'center',
                            cursor: 'pointer',
                            margin: '16px 0',
                            backgroundColor: isDragActive ? '#e0e0e0' : 'transparent',
                        }}
                    >
                        <input {...getInputProps()} />
                        {image ? (
                            <>
                                <Typography variant="body1">Selected file: {image.name}</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleRemoveImage}
                                    sx={{ marginTop: '8px', backgroundColor: 'error.main', color: 'white' }}
                                >
                                    Use another image
                                </Button>
                            </>
                        ) : usingDefaultImage ? (
                            <>
                                <Typography variant="body1">Selected file: Default image</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleRemoveImage}
                                    sx={{ marginTop: '8px', backgroundColor: 'error.main', color: 'white' }}
                                >
                                    Use another image
                                </Button>
                            </>
                        
                        ) : (
                            <>
                                <Typography variant="body1">
                                    Drag & drop or click to select an image
                                    {selectedApiPlantId && <strong>, or use default image</strong>}
                                </Typography>
                            </>
                        )}

                    </Box>

                    {selectedApiPlantId && (
                        <Button
                            variant="outlined"
                            onClick={handleUseDefaultImageWrapper} 
                            sx={{ marginTop: '8px', marginBottom: '16px', backgroundColor: 'secondary.light', color: 'secondary.dark' }}
                        >
                            Use Default Image
                        </Button>
                    )}

                    <TextField
                        label="Plant Name"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        sx={{ marginBottom: '16px' }}
                    />
                    <TextField
                        label="Last Watered"
                        type="date"
                        variant="outlined"
                        fullWidth
                        name="lastWatered"
                        value={formData.lastWatered}
                        onChange={handleChange}
                        sx={{ marginBottom: '16px' }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={
                            { max: format(new Date(), 'yyyy-MM-dd')}
                        }
                    />
                    <TextField
                        select
                        label="Watering Frequency"
                        variant="outlined"
                        fullWidth
                        name="wateringFrequency"
                        value={formData.wateringFrequency}
                        onChange={handleChange}
                        sx={{ marginBottom: '16px', textAlign: 'left' }}
                    >
                        <MenuItem value="Every Day">Every Day</MenuItem>
                        <MenuItem value="every second day">Every Second Day</MenuItem>
                        <MenuItem value="weekly">Once a Week</MenuItem>
                        <MenuItem value="monthly">Once a Month</MenuItem>
                    </TextField>

                    <Button
                        variant="contained"
                        onClick={handleAddPlant} // Use the handleAddPlant function here
                        sx={{ marginTop: '16px', backgroundColor: 'secondary.light', color: 'secondary.dark' }}
                    >
                        Add Plant
                    </Button>

                    {/* Error message display */}
                    {errorMessage && (
                        <Typography variant="body1" sx={{ color: 'error.main', marginBottom: '16px', marginTop: '16px' }}>
                            {errorMessage}
                        </Typography>
                    )}

                    {/* Success message display */}
                    {successMessage && (
                        <Typography variant="body1" sx={{ color: 'primary.dark', marginBottom: '16px', marginTop: '16px' }}>
                            {successMessage}
                        </Typography>
                    )}

                </Box>
            )}
        </Box>
    );
}
