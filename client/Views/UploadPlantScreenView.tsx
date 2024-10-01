import React, { useState } from 'react';
import { Typography, Box, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { searchSpecies } from "../../server/Models/plantModel";


type Props = {
    image: File | null;
    searchQuery: string;
    searchResult: any[];
    loading: boolean;
    formVisible: boolean;
    formData: {
        name: string;
        lastWatered: string;
        waterFrequency: string;
    };
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectPlant: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (acceptedFiles: File[]) => void;
    isDragActive: boolean;
    onAddToProfile: () => void;
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
    onAddToProfile,
}: Props) {
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
            <Typography
                variant="h2"
                sx={{
                    color: 'primary.dark',
                    marginBottom: '16px',
                }}
            >
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

            {/* loading spinner while searching */}
            {loading && <CircularProgress sx={{ marginBottom: '16px', color: 'secondary.dark' }} />}

            {/* Search results */}
            {searchResult.length > 0 ? (
                <Box sx={{ 
                    marginBottom: '16px', 
                    width: '100%', 
                    maxWidth: '600px', 
                }}>
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
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px', marginTop: '8px', border: 'px solid ##B41878' }}
                                />
                            )}
                            <Button
                                variant="contained"
                                onClick={handleSelectPlant}
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
                searchQuery && !loading && (
                    <Box sx={{ marginBottom: '16px' }}>
                        <Typography variant="body1">
                            Sorry, we don't recognize that plant...please add it manually!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleSelectPlant}
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
                        border: '1px solid primary.dark',
                        backgroundColor: '#fafafa',
                        marginTop: '16px',
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
                            <Typography variant="body1">Selected file: {image.name}</Typography>
                        ) : (
                            <Typography variant="body1">
                                Drag & drop or click to select an image, or{' '}
                                {searchResult && <strong>use default image</strong>}
                            </Typography>
                        )}
                    </Box>

                    {/* Input fields */}
                    <TextField
                        label="Plant Name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: '16px' }}
                    />

                    <TextField
                        label="When was this plant last watered?"
                        name="lastWatered"
                        type="date"
                        value={formData.lastWatered}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: '16px' }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    {/* Water frequency select if add manually*/}
                    {!searchResult.length && (
                        <TextField
                            label="How often does this plant need water?"
                            name="waterFrequency"
                            select
                            value={formData.waterFrequency}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            sx={{ marginBottom: '16px' }}
                        >
                            {["Every day", "Every second day", "Three times a week", "Twice a week", "Once a week", "Every second week", "Every third week", "Once a month"].map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                    )}

                    <Button
                        variant="contained"
                        onClick={onAddToProfile}
                        sx={{
                            backgroundColor: 'secondary.light',
                            color: 'secondary.dark',
                            padding: '12px 24px',
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                                color: 'secondary.light',
                            },
                        }}
                    >
                        Add Plant
                    </Button>
                </Box>
            )}
        </Box>
    );
}
