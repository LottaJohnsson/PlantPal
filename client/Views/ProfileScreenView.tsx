import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { on } from 'events';
import { useEffect } from 'react';

type Props = {
  todayTasks: any[];
  lateTasks: any[];
  upcomingTasks: any[];
  plants: any[];
  onAddNewPlant: () => void;
};

export default function ProfileScreenView({ 
  todayTasks, 
  lateTasks, 
  upcomingTasks, 
  plants, 
  onAddNewPlant 
}: Props) {

    useEffect(() => {
        return () => {
            plants.forEach(plant => {
                if (plant.imageFile) {
                    URL.revokeObjectURL(plant.imageFile);
                }
            });
        };
    }, [plants]);

    
  return (
    <Box sx={{ 
        padding: '24px' 
        }}>
        {/* Today's Tasks */}
        <Typography variant="h5" sx={{ marginBottom: '16px', color: '#000' }}>Today's Tasks</Typography>
        <Grid container spacing={2}>
            {todayTasks.map((task, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
                <Box sx={{ 
                    padding: '16px', 
                    backgroundColor: 'secondary.light', 
                    borderRadius: '8px', 
                    color: '#FFF', 
                    minWidth: '100px',
                    maxWidth: '400px',
                    '&:hover': {
                        backgroundColor: 'secondary.dark',
                        color: 'secondary.light',
                    }
                    }}>
                    <Typography>{task.date}</Typography>
                    <Typography>{task.taskName}</Typography>
                </Box>
            </Grid>
        ))}
        </Grid>

        

        {/* Late Tasks */}
        <Typography variant="h5" sx={{ marginTop: '32px', marginBottom: '16px', color: '#000' }}>Late Tasks</Typography>
        <Grid container spacing={2}>
            {todayTasks.map((task, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
                <Box sx={{ 
                    padding: '16px', 
                    backgroundColor: '#FFB9B9',
                    borderRadius: '8px', 
                    color: '#FFF', 
                    minWidth: '100px',
                    maxWidth: '400px',
                    '&:hover': {
                        backgroundColor: '#DD5656',
                        color: '#FFB9B9',
                    }
                    }}>
                    <Typography>{task.date}</Typography>
                    <Typography>{task.taskName}</Typography>
                </Box>
            </Grid>
        ))}
        </Grid>

        {/* Upcoming Tasks */}
        <Typography variant="h5" sx={{ marginTop: '32px', marginBottom: '16px', color: '#000' }}>Upcoming Tasks</Typography>
        <Grid container spacing={2}>
            {upcomingTasks.map((task, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
                <Box sx={{ 
                    padding: '16px', 
                    backgroundColor: 'primary.light', 
                    borderRadius: '8px', 
                    color: '#FFF', 
                    minWidth: '100px',
                    maxWidth: '400px',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                        color: 'primary.light',
                    }
                    }}>
                <Typography>{task.date}</Typography>
                <Typography>{task.taskName}</Typography>
                </Box>
            </Grid>
            ))}
        </Grid>

        {/* Plants Section */}
        <Typography variant="h5" sx={{ marginTop: '32px', marginBottom: '16px', color: '#000' }}>Your Plants</Typography>
        <Grid container spacing={2}>
            {plants.length > 0 ? (
                plants.map((plant, index) => {
                    // Create a blob URL for blob images, or use the regular URL
                    const imageSrc = plant.imageFile && !plant.imageURL ? URL.createObjectURL(plant.imageFile) : plant.imageURL;

                    return (
                        <Grid item key={index} xs={6} sm={4} md={3}>
                            <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
                                {imageSrc ? (
                                    <img
                                        src={imageSrc}
                                        alt={plant.name}
                                        style={{ width: '100px', height: '100px', borderRadius: '8px' }}
                                    />
                                ) : (
                                    <div>No Image Available</div>
                                )}
                                <Typography>{plant.name}</Typography>
                            </Box>
                        </Grid>
                    );
                })
            ) : (
                <Typography>No plants found</Typography>
            )}
        </Grid>

        {/* Add New Plant Button */}
        <Box sx={{ marginTop: '16px', textAlign: 'left' }}>
            <Button variant="contained" onClick={onAddNewPlant} sx={{
                backgroundColor: 'secondary.light',
                color: 'secondary.dark',
                margin: '8px',
                '&:hover': {
                    backgroundColor: 'secondary.dark',
                    color: 'secondary.light',
                }
            }}>
                Add New Plant
            </Button>
        </Box>

    </Box>
  );
}