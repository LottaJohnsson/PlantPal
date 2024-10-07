import React from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';

type Props = {
  todayTasks: any[];
  lateTasks: any[];
  upcomingTasks: any[];
  plants: any[];
  onAddNewPlant: () => void;
  loading: boolean; // Accept loading prop
};

export default function ProfileScreenView({
  todayTasks,
  lateTasks,
  upcomingTasks,
  plants,
  onAddNewPlant,
  loading, // Destructure loading prop
}: Props) {
  return (
    <Box sx={{ padding: '24px' }}>
      {/* Loading Spinner */}
      {loading && <CircularProgress sx={{ marginBottom: '16px', color: 'secondary.dark' }} />}

      {/* Today's Tasks */}
      <Typography variant="h5" sx={{ marginBottom: '16px', color: '#000' }}>
        Today's Tasks
      </Typography>
      <Grid container spacing={2}>
        {todayTasks.map((task, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Box
              sx={{
                padding: '16px',
                backgroundColor: 'secondary.light',
                borderRadius: '8px',
                color: '#FFF',
                minWidth: '100px',
                maxWidth: '400px',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                  color: 'secondary.light',
                },
              }}
            >
              <Typography>{task.date}</Typography>
              <Typography>{task.taskName}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Late Tasks */}
      <Typography variant="h5" sx={{ marginTop: '32px', marginBottom: '16px', color: '#000' }}>
        Late Tasks
      </Typography>
      <Grid container spacing={2}>
        {lateTasks.map((task, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Box
              sx={{
                padding: '16px',
                backgroundColor: '#FFB9B9',
                borderRadius: '8px',
                color: '#FFF',
                minWidth: '100px',
                maxWidth: '400px',
                '&:hover': {
                  backgroundColor: '#DD5656',
                  color: '#FFB9B9',
                },
              }}
            >
              <Typography>{task.date}</Typography>
              <Typography>{task.taskName}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Tasks */}
      <Typography variant="h5" sx={{ marginTop: '32px', marginBottom: '16px', color: '#000' }}>
        Upcoming Tasks
      </Typography>
      <Grid container spacing={2}>
        {upcomingTasks.map((task, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Box
              sx={{
                padding: '16px',
                backgroundColor: 'primary.light',
                borderRadius: '8px',
                color: '#FFF',
                minWidth: '100px',
                maxWidth: '400px',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  color: 'primary.light',
                },
              }}
            >
              <Typography>{task.date}</Typography>
              <Typography>{task.taskName}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Plants Section */}
      <Typography variant="h5" sx={{ marginTop: '32px', marginBottom: '16px', color: '#000' }}>
        Your Plants
      </Typography>
      <Grid container spacing={2}>
        {plants.length > 0 ? (
          plants.map((plant, index) => {
            const imageSrc = plant.imageFile && !plant.imageURL ? `data:image/jpg;base64,${plant.imageFile}` : plant.imageURL;

            return (
              <Grid item key={index} xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={plant.name}
                      style={{ width: '200px', height: '200px', border: '2px solid #B41878' }}
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
          <Typography sx={{ marginLeft: '16px' }}>
            You don't have any plants yet. Click below to add one!
          </Typography>
        )}
      </Grid>

      {/* Add New Plant Button */}
      <Box sx={{ marginTop: '16px', textAlign: 'left' }}>
        <Button
          variant="contained"
          onClick={onAddNewPlant}
          sx={{
            backgroundColor: 'secondary.light',
            color: 'secondary.dark',
            margin: '8px',
            '&:hover': {
              backgroundColor: 'secondary.dark',
              color: 'secondary.light',
            },
          }}
        >
          Add New Plant
        </Button>
      </Box>
    </Box>
  );
}
