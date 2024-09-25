import React from 'react'
import { Stack, TextField, Button, Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

type Props = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LoginScreenView({ setIsLogin }: Props) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ height: '100vh', padding: 0 }} 
    >
      <Stack
        component="form"
        spacing={2}
        noValidate
        autoComplete="off"
        sx={{ flex: 1, '& > :not(style)': { width: '100%' } }}
      >
        <div
        style={{marginBottom: '20%'}}
        >
          <Typography variant='h2'>Are your plants dying?</Typography>
          <Typography variant='h2'>Login to save them!</Typography>
        </div>
        <div>
          <Stack spacing={2}>
            <Typography variant='h4'>Sign in</Typography>
            <TextField
              required
              id="outlined-required"
              label="Email"
            />
            <TextField
              required
              id="outlined-required"
              label="Password"
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography>Don’t have an account? 
                <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false);}}> Register</a>
              </Typography>
              <Button variant="contained">Sign in</Button>
            </Stack>
          </Stack>
        </div>
      </Stack>
      <img style={{ height: '100vh', width: '100%', objectFit: 'contain', flex: 1, objectPosition: 'right bottom' }} src='elle-lumiere-Dze_6fnPIKk-unsplash.jpg' alt='Plant Image'></img>
    </Stack>
  )
}