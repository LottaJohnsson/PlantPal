import React from 'react'
import {Stack, TextField, Button, Typography, Alert, CircularProgress} from '@mui/material'

type Props = {
    error: string
    loading: boolean
    setIsLogin: (isLogin: boolean) => void
    onEmailChange: (event: string) => void
    onPasswordChange: (password: string) => void
    onConfirmPassswordChange: (password: string) => void
    onSubmit : () => void
}

export default function RegisterScreenView({error, loading, setIsLogin, onEmailChange, onPasswordChange, onConfirmPassswordChange, onSubmit }: Props) {
    function emailInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        onEmailChange(event.target.value)
    }

    function passwordInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        onPasswordChange(event.target.value)
    } 

    function confirmPasswordInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        onConfirmPassswordChange(event.target.value)
    } 

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        onSubmit()
    }

    return (
        <Stack
            direction="row"
            sx={{height: '100vh', padding: 0}}
        >
            <Stack
                component="form"
                spacing={2}
                noValidate
                autoComplete="off"
                sx={{flex: 1, '& > :not(style)': {width: '100%'}, marginLeft: '2%'}}
            >
                <div style={{marginBottom: '10%', marginTop: '10%'}}>
                    <Typography variant='h2'>Are your plants dying?</Typography>
                    <Typography variant='h2' color="primary">Login to save them!</Typography>
                </div>
                <div>
                    <Stack spacing={2}>
                        <Typography variant='h4' color="secondary">Register</Typography>
                        <Alert severity="error" sx={{display: error !== '' ? 'flex' : 'none'}}>{error}</Alert>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            type='email'
                            color="secondary"
                            onChange={emailInputChanged}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Password"
                            type='password'
                            color="secondary"
                            onChange={passwordInputChanged}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Confirm Password"
                            type='password'
                            color="secondary"
                            onChange={confirmPasswordInputChanged}
                        />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Already have an account?
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setIsLogin(true);
                                }}> Login</a>
                            </Typography>
                            {loading ? 
                                <CircularProgress /> : 
                                <Button 
                                    variant="contained" 
                                    sx={{backgroundColor: "secondary.light"}} 
                                    onClick={handleSubmit}>Register
                                </Button>
                        }
                        </Stack>
                    </Stack>
                </div>
            </Stack>
            <img style={{height: '100vh', width: '100%', objectFit: 'contain', flex: 1, objectPosition: 'right bottom'}}
                 src='elle-lumiere-Dze_6fnPIKk-unsplash.jpg' alt='Plant Image'></img>
        </Stack>
    )
}