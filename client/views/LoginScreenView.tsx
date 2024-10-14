import React from 'react'
import {Stack, TextField, Button, Typography, Alert, CircularProgress} from '@mui/material'

type Props = {
    error: string
    loading: boolean
    setIsLogin: (isLogin: boolean) => void
    onEmailChange: (event: string) => void
    onPasswordChange: (password: string) => void
    onSubmit: () => void
}

export default function LoginScreenView(
    {
        error,
        loading,
        setIsLogin,
        onEmailChange,
        onPasswordChange,
        onSubmit
    }: Props) {

        const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
            if (event.key === 'Enter') {
                onSubmit();
            }
        };

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
            <div
                style={{
                    height: '100vh',
                    width: '100vw',
                    background: 'linear-gradient(to right, white, #DFE0E2)', 
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        height: '100%', 
                    }}
                >
                    <Stack
                        component="form"
                        spacing={2}
                        noValidate
                        autoComplete="off"
                        sx={{ flex: 1, '& > :not(style)': { width: '100%' }, marginLeft: '2%' }}
                        onKeyDown={handleKeyDown}
                    >
                        <div style={{ marginBottom: '10%', marginTop: '10%' }}>
                            <Typography variant='h2'>Are your plants dying?</Typography>
                            <Typography variant='h2' color="primary.dark">Login to save them!</Typography>
                        </div>
                        <div>
                            <Stack spacing={2} sx={{ width: "100%" }}>
                                <Typography variant='h4' color={"secondary"}>Sign in</Typography>
                                <Alert severity="error" sx={{ display: error !== '' ? 'flex' : 'none' }}>{error}</Alert>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Email"
                                    type="email"
                                    color="secondary"
                                    onChange={emailInputChanged}
                                />
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Password"
                                    type="password"
                                    color="secondary"
                                    onChange={passwordInputChanged}
                                />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography>Don’t have an account?
                                        <a href="#" style={{color: '#B41878'}} onClick={(e) => {
                                            e.preventDefault();
                                            setIsLogin(false);
                                        }}> Register</a>
                                    </Typography>
                                    {loading ?
                                        <CircularProgress /> :
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'secondary.light',
                                                color: 'secondary.dark',
                                                '&:hover': {
                                                    backgroundColor: 'secondary.dark',
                                                    color: 'secondary.light'
                                                }
                                            }}
                                            onClick={handleSubmit}
                                        >
                                            Sign in
                                        </Button>
                                    }
                                </Stack>
                            </Stack>
                        </div>
                    </Stack>
                    <img
                        style={{
                            height: '100vh',
                            width: '100%',
                            objectFit: 'contain',
                            flex: 1,
                            objectPosition: 'right bottom',
                            maskImage: 'linear-gradient(to right, transparent 30%, black 40%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 30%, black 40%)', 
                        }}
                        src='elle-lumiere-Dze_6fnPIKk-unsplash.jpg'
                        alt='Smoothly Blended Image'
                    />
                </Stack>
            </div>
        );
}