import React from "react";
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Task } from "../redux/slices/userSlice";

interface Props {
    task: Task
    onCompleteTask: (task: any) => void
    darkcolor: string,
    lightcolor: string,
    completable: boolean
}

export default function TaskBox({
    task,
    onCompleteTask,
    darkcolor,
    lightcolor,
    completable
}: Props) {
    return (
        <Grid item xs={12} sm={6} md={4}>
        <Box
            sx={{
            padding: '16px',
            backgroundColor: lightcolor,
            borderRadius: '8px',
            color: '#FFF',
            minWidth: '100px',
            maxWidth: '400px',
            position: 'relative',
            overflow: 'hidden',
            }}
        >
            {/* Darker box for the date that takes up full width and aligns to the top */}
            <Box
            sx={{
                backgroundColor: darkcolor,
                borderRadius: '8px 8px 0 0',
                padding: '4px',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
            }}
            >
            <Typography sx={{ paddingLeft: '20px' }}>{task.date}</Typography>
            </Box>

            <Box sx={{ paddingTop: '40px', paddingRight: '40px', paddingLeft: '40px' }}>
            <Typography>{task.taskName}</Typography>
            </Box>

            {/* Checkmark Icon to remove the task */}
            <CheckCircleIcon
            onClick={() => onCompleteTask(task)}
            sx={{
                color: '#FFF',
                fontSize: '24px',
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                cursor: 'pointer',
                '&:hover': {
                color: 'primary.dark',
                },
                display: completable? 'initial' : 'none'
            }}
            />
        </Box>
        </Grid>
    );
}