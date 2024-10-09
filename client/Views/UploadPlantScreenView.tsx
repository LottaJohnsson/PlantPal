import React, { useState, useEffect } from 'react';
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
    onAddPlant: (plantData: Plant) => Promise<{ success: boolean; exists: boolean }>;
    selectedApiPlantId: string | null;
    isPlantSelected: boolean;
    handleRemoveImage: () => void;
    handleUseDefaultImage: () => void;
    usingDefaultImage: boolean;
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
    usingDefaultImage,
}: Props) {
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [plantAlreadyExists, setPlantAlreadyExists] = useState<boolean>(false);

    // Validation function to check if all fields are filled
    const isFormValid = () => {
        return (
            (image !== null || usingDefaultImage) &&
            formData.name.trim() !== '' &&
            formData.lastWatered.trim() !== '' &&
            formData.wateringFrequency.trim() !== ''
        );
    };

    const handleAddPlant = async () => {
        // Clear previous messages
        setErrorMessage(null);
        setSuccessMessage(null);
        setPlantAlreadyExists(false);
    
        // Validate the form before adding the plant
        if (!isFormValid()) {
            setErrorMessage("You need to fill in everything to add the plant!");
            return;
        }
    
        const plantData: Plant = {
            id: formData.id,
            name: formData.name,
            lastWatered: formData.lastWatered,
            wateringFrequency: formData.wateringFrequency,
            imageURL: formData.imageURL,
            imageFile: formData.imageFile,
        };
    
        const { success, exists } = await onAddPlant(plantData); // Get the result from the controller
    
        if (exists) {
            // If the plant already exists, show an error message
            setErrorMessage("Plant name already exists in profile, please choose another name.");
            setPlantAlreadyExists(true);
        } else if (success) {
            // If the plant was added successfully, show a success message
            setSuccessMessage("Plant added successfully!");
        } else {
            // Handle any other errors
            setErrorMessage("Something went wrong. Please try again.");
        }
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

            {loading && <CircularProgress sx={{ marginBottom: '16px', color: 'secondary.dark' }} />}

            {searchResult.length > 0 ? (
                <Box sx={{ marginBottom: '16px', width: '100%', maxWidth: '600px' }}>
                    {searchResult.map((plant: any) => (
                        <Box
                            key={plant.id}
                            sx={{
                                marginBottom: '16px',
                                marginTop: '16px',
                                borderRadius: '8px',
                                padding: '16px',
                                backgroundColor: 'info.main',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h5">
                                {plant.common_name || plant.scientific_name}
                            </Typography>
                            {plant.default_image?.original_url && (
                                <img
                                    src={plant.default_image.original_url}
                                    alt={plant.common_name || plant.scientific_name}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        border: '2px solid #B41878',
                                    }}
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
                searchResult.length === 0 &&
                !isPlantSelected &&
                searchQuery &&
                !loading && (
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
                    {/* Drag-and-drop with image preview */}
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
                            backgroundColor: 'transparent',
                            '&:hover': { border: '2px dashed #B41878', color: 'secondary.dark' },
                            ...(!image && !usingDefaultImage && errorMessage && {
                                border: '2px dashed red',
                            }),
                        }}
                    >
                        <input {...getInputProps()} />
                        {image ? (
                            <>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px', border: '2px solid #B41878' }}
                                />
                                <Typography variant="body1">Selected file: {image.name}</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleRemoveImage}
                                    sx={{
                                        marginTop: '8px',
                                        backgroundColor: 'secondary.light',
                                        color: 'secondary.dark',
                                        '&:hover': {
                                            backgroundColor: 'secondary.dark',
                                            color: 'secondary.light',
                                        },
                                    }}
                                >
                                    Use another image
                                </Button>
                            </>
                        ) : usingDefaultImage ? (
                            <>
                                <img
                                    src={formData.imageURL}
                                    alt="Preview"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px', border: '2px solid #B41878' }}
                                />
                                <Typography variant="body1">Selected file: Default image</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleRemoveImage}
                                    sx={{
                                        marginTop: '8px',
                                        backgroundColor: 'secondary.light',
                                        color: 'secondary.dark',
                                        '&:hover': {
                                            backgroundColor: 'secondary.dark',
                                            color: 'secondary.light',
                                        },
                                    }}
                                >
                                    Use another image
                                </Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="body1">
                                    Drag & drop or click to select an image {selectedApiPlantId && ' or use default image'}
                                </Typography>
                            </>
                        )}
                    </Box>

                    {selectedApiPlantId && !usingDefaultImage && (
                        <Button
                            variant="outlined"
                            onClick={handleUseDefaultImage}
                            sx={{
                                marginTop: '8px',
                                backgroundColor: 'secondary.light',
                                color: 'secondary.dark',
                                marginbottom: '16px',
                                '&:hover': {
                                    backgroundColor: 'secondary.dark',
                                    color: 'secondary.light',
                                },
                            }}
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
                        sx={{ marginBottom: '16px', marginTop: '16px',
                            '& .MuiFormHelperText-root': {
                            color: 'red',
                          },}}
                        helperText={errorMessage && !formData.name.trim() ? 'Please enter a plant name' : ''}

                    />
                    <TextField
                        label="Last Watered"
                        type="date"
                        variant="outlined"
                        fullWidth
                        name="lastWatered"
                        value={formData.lastWatered}
                        onChange={handleChange}
                        sx={{ marginBottom: '16px',
                            '& .MuiFormHelperText-root': {
                            color: 'red', 
                          },}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={
                            { max: format(new Date(), 'yyyy-MM-dd')}
                        }
                        helperText={errorMessage && !formData.lastWatered.trim() ? 'Please enter a date' : ''}
                    />
                    <TextField
                        select
                        label="Watering Frequency"
                        variant="outlined"
                        fullWidth
                        name="wateringFrequency"
                        value={formData.wateringFrequency}
                        onChange={handleChange}
                        helperText={errorMessage && !formData.wateringFrequency.trim() ? 'Please select how often you would like to water this plant' : ''}
                        sx={{
                            marginBottom: '16px',
                            textAlign: 'left',
                            '& .MuiInputBase-root': {
                            color: 'secondary.dark', 
                            },
                            '& .MuiFormHelperText-root': {
                                color: 'red', 
                              },
                        }}
                        InputLabelProps={{
                            style: { color: 'primary.dark' },
                        }}
                        >
                        <MenuItem value="Every Day">Every Day</MenuItem>
                        <MenuItem value="every second day">Every Second Day</MenuItem>
                        <MenuItem value="weekly">Once a Week</MenuItem>
                        <MenuItem value="monthly">Once a Month</MenuItem>
                    </TextField>

                    {/* Add plant button */}
                    <Button
                        variant="contained"
                        onClick={handleAddPlant}
                        sx={{
                            backgroundColor: 'secondary.light',
                            color: 'secondary.dark',
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                                color: 'secondary.light',
                            },
                        }}
                    >
                        Add Plant
                    </Button>

                    {/* Error or success messages */}
                    {errorMessage && <Typography color="error" sx={{ marginTop: '16px' }}>{errorMessage}</Typography>}
                    {successMessage && <Typography color="success" sx={{ marginTop: '16px' }}>{successMessage}</Typography>}
                </Box>
            )}
        </Box>
    );
}
