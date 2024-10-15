import React from 'react';
import { Typography, Box, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import moment from 'moment';
import {UserPlant} from '../redux/slices/userSlice'
import {Plant} from '../redux/slices/plantSlice'

type Props = {
    image: File | null;
    searchQuery: string;
    searchResult: any[];
    loading: boolean;
    formVisible: boolean;
    formData: UserPlant;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectPlant: (plant: any) => void;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (acceptedFiles: File[]) => void;
    isDragActive: boolean;
    onAddPlant: () => Promise<void>;
    selectedApiPlantId: string | null;
    handleRemoveImage: () => void;
    handleUseDefaultImage: () => void;
    usingDefaultImage: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    getRootProps: any;
    getInputProps: any;
    selectedPlant: Plant | null;
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
    handleFormChange,
    onAddPlant,
    selectedApiPlantId,
    handleRemoveImage,
    handleUseDefaultImage,
    usingDefaultImage,
    errorMessage,
    successMessage,
    getRootProps,
    getInputProps,
    selectedPlant,
}: Props) {

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
                !selectedPlant &&
                searchQuery &&
                !loading && (
                    <Box sx={{ marginBottom: '16px' }}>
                        <Typography variant="body1">
                            Sorry, we don't recognize that plant...please add it manually!
                        </Typography>
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
                                    Drag & drop or click to select an image {selectedApiPlantId && selectedPlant?.default_image?.small_url && ' or use default image'}
                                </Typography>
                            </>
                        )}
                    </Box>

                    {selectedApiPlantId && selectedPlant?.default_image?.small_url && !usingDefaultImage && (
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
                        onChange={handleFormChange}
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
                        onChange={handleFormChange}
                        sx={{ marginBottom: '16px',
                            '& .MuiFormHelperText-root': {
                            color: 'red', 
                          },}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={
                            { max: moment().format('YYYY-MM-DD') }
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
                        onChange={handleFormChange}
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
                        onClick={onAddPlant}
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
                    {errorMessage && <Typography color="red" sx={{ marginTop: '16px' }}>{errorMessage}</Typography>}
                </Box>
            )}
        </Box>
    );
}
