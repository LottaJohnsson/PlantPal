import React from 'react'
import {Typography, Box} from '@mui/material'

type Props = {}

export default function AboutScreenView({}: Props) {
    return (
        <>
            <Box position='relative' height='50vh' display='flex' alignItems='center' justifyContent='center'>
                {/* Background Image */}
                <Box
                    component="img"
                    src="aboutPageImage.jpg"
                    alt="Plant Background"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        zIndex: -1,
                        opacity: 0.9,
                    }}
                />

                {/* Logo and Text */}
                <Box textAlign='center' display='flex' flexDirection='column' alignItems='center'>
                    <Box display='flex' alignItems='center' marginBottom='50px'>
                        <Box
                            component="img"
                            src="/logo.png"
                            alt="PlantPal Logo"
                            width='170px'
                            height='170px'
                            marginRight='8px'
                        />
                        <Typography variant="h1" color="primary.dark">
                            PlantPal
                        </Typography>
                    </Box>
                    <Typography variant="h3" color='info'>
                        Green thumbs made easy!
                    </Typography>
                </Box>
            </Box>

            {/* Content Section */}
            <Box textAlign='left' px='15%' py='50px'>
                <Typography variant="h2" color="secondary.dark" fontSize={'5rem'}>
                    Who Are We?
                </Typography>
            </Box>
            <Box textAlign='left' px='15%' paddingBottom='50px'>
                <Typography variant="h5">
                    At Plant Pal, we’re passionate about helping you take the best care of your plants.
                    Whether you’re a seasoned plant enthusiast or just starting your plant journey,
                    Plant Pal provides easy-to-follow care tips tailored to your specific plants.
                    From watering schedules to sunlight requirements, we’ve got all the insights you
                    need to help your plants thrive. With Plant Pal by your side, keeping your plants
                    happy and healthy has never been easier!
                </Typography>
            </Box>
        </>
    )
}
