import React, {useState} from 'react'
import {Typography, Box, Stack, Button, TextField} from '@mui/material'
import { useDropzone } from 'react-dropzone'

type Props = {}

export default function UploadPlantScreenView({}: Props) {

    const [showForm, setShowForm] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        whenBought: '',
        placement: ''
    });

    // Handle file drop
    const onDrop = (acceptedFiles: File[]) => {
        setImage(acceptedFiles[0]);
    };

    // Dropzone config
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    // Handle form field change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                Add a new plant to your collection! Don’t know the name of your plant? Don’t worry, 
                use the identify button to identify the plant with an image. If you already know what 
                plant you have, use the fill in button!
            </Typography>

            <Stack
                direction="row"
                spacing={4}
                sx={{
                    justifyContent: 'center',
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'secondary.light', 
                        color: 'secondary.dark',
                        fontSize: '1rem',
                        padding: '12px 24px',
                        '&:hover': {
                            backgroundColor: 'secondary.dark', 
                            color: 'secondary.light',
                        }
                    }}
                    onClick={() => setShowForm(true)}
                >
                    Fill in
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'secondary.light', 
                        color: 'secondary.dark',
                        fontSize: '1rem',
                        padding: '12px 24px',
                        '&:hover': {
                            backgroundColor: 'secondary.dark', 
                            color: 'secondary.light',
                        }
                    }}
                    
                >
                    Identify
                </Button>
            </Stack>

            {/* Form that pops up when 'Fill in' is clicked */}
            {showForm && (
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
                        marginTop: '32px',
                    }}
                >
                    {/* File Upload */}
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            padding: '16px',
                            width: '100%',
                            textAlign: 'center',
                            cursor: 'pointer',
                            marginBottom: '16px',
                            backgroundColor: isDragActive ? '#e0e0e0' : 'transparent',
                        }}
                    >
                        <input {...getInputProps()} />
                        {image ? (
                            <Typography variant="body1">Selected file: {image.name}</Typography>
                        ) : (
                            <Typography variant="body1">
                                {isDragActive ? 'Drop the files here...' : 'Drag & drop or click to select an image'}
                            </Typography>
                        )}
                    </Box>

                    <TextField
                        label="Plant Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: '16px' }}
                    />

                    <TextField
                        label="When Bought"
                        name="whenBought"
                        value={formData.whenBought}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: '16px' }}
                    />

                    <TextField
                        label="Placement"
                        name="placement"
                        value={formData.placement}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: '16px' }}
                    />

                    <TextField
                        label="Size"
                        name="size"
                        value={formData.placement}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: '16px' }}
                    />

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: 'primary.light',
                            color: 'primary.dark',
                            padding: '12px 24px',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                                color: 'primary.light',
                            },
                        }}
                    >
                        Add Plant
                    </Button>
                </Box>
            )}

        </Box>
    )
}