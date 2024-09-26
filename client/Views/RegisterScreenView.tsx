import React from 'react'
import {Stack, TextField, Button, Typography, Box} from '@mui/material'

type Props = {
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
}

export default function RegisterScreenView({setIsLogin}: Props) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            sx={{height: '100vh', padding: 0}}
        >
            <Stack
                component="form"
                spacing={2}
                noValidate
                autoComplete="off"
                sx={{flex: 1, '& > :not(style)': {width: '100%'}}}
            >
                <div
                    style={{marginBottom: '20%', marginTop: '5%'}}
                >
                    <Typography variant='h2'>Are your plants dying?</Typography>
                    <Typography variant='h2' color="primary">Login to save them!</Typography>
                </div>
                <div>
                    <Stack spacing={2}>
                        <Typography variant='h4' color="secondary">Register</Typography>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            color="secondary"
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Password"
                            color="secondary"
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Confirm Password"
                            color="secondary"
                        />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Already have an account?
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setIsLogin(true);
                                }}> Login</a>
                            </Typography>
                            <Button variant="contained" sx={{backgroundColor: "secondary.light"}}>Register</Button>
                        </Stack>
                    </Stack>
                </div>
            </Stack>
            <img style={{height: '100vh', width: '100%', objectFit: 'contain', flex: 1, objectPosition: 'right bottom'}}
                 src='elle-lumiere-Dze_6fnPIKk-unsplash.jpg' alt='Plant Image'></img>
        </Stack>
    )
}