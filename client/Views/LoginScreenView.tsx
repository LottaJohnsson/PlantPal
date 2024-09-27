import React from 'react'
import {Stack, TextField, Button, Typography, Box} from '@mui/material'
import Grid from '@mui/material/Grid2'
import TopBar from "../components/TopBar";

type Props = {
    error: string
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
    onEmailChange: (event: string) => void
    onPasswordChange: (password: string) => void
    onSubmit : () => void
}

export default function LoginScreenView({error, setIsLogin, onEmailChange, onPasswordChange, onSubmit}: Props) {
    
    function emailInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        onEmailChange(event.target.value)
    }

    function passwordInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        onPasswordChange(event.target.value)
    } 

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        onSubmit()
    }

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
                        <Typography variant='h4' color={"secondary"}>Sign in</Typography>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            color="secondary"
                            onChange={emailInputChanged}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Password"
                            color="secondary"
                            onChange={passwordInputChanged}

                        />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Don’t have an account?
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setIsLogin(false);
                                }}> Register</a>
                            </Typography>
                            <Button 
                                    variant="contained"
                                    sx={{backgroundColor: 'secondary.light'}}
                                    onClick={handleSubmit}
                                    >Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </div>
            </Stack>
            <img style={{
                height: '100vh',
                width: '100%',
                objectFit: 'contain',
                flex: 1,
                objectPosition: 'right bottom'
            }}
                 src='elle-lumiere-Dze_6fnPIKk-unsplash.jpg' alt='Plant Image'></img>
        </Stack>
    )
}