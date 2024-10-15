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

    return (
        <Stack
            direction="row">
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
                    <Stack spacing={2} sx={{width: "100%"}}>
                        <Typography variant='h4' color={"secondary"}>Sign in</Typography>
                        <Alert severity="error" sx={{display: error !== '' ? 'flex' : 'none'}}>{error}</Alert>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            type="email"
                            color="secondary"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onEmailChange(event.target.value)}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') onSubmit()
                            }}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Password"
                            type="password"
                            color="secondary"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(event.target.value)}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') onSubmit()
                            }}
                        />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Don’t have an account?
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setIsLogin(false);
                                }}> Register</a>
                            </Typography>
                            {loading ?
                                <CircularProgress/> :
                                <Button
                                    variant="contained"
                                    sx={{backgroundColor: 'secondary.light'}}
                                    onClick={() => onSubmit()}
                                >Sign in
                                </Button>
                            }
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