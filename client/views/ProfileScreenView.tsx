import React from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type Props = {
  todayTasks: any[];
  lateTasks: any[];
  upcomingTasks: any[];
  plants: any[];
  onAddNewPlant: () => void;
  loading: boolean; // Accept loading prop
  onCompleteTask: (task: any) => void;
  doneTasks: any[];
};

export default function ProfileScreenView({
  todayTasks,
  lateTasks,
  upcomingTasks,
  plants,
  onAddNewPlant,
  loading,
  onCompleteTask,
  doneTasks,
}: Props) {
  return (
    <Box sx={{ padding: '24px' }}>
      {/* Top Bar and Loading Spinner */}
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
          <CircularProgress sx={{ color: 'secondary.dark' }} />
        </Box>
      ) : (
        <>
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
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Darker box for the date that takes up full width and aligns to the top */}
                  <Box
                    sx={{
                      backgroundColor: 'secondary.dark',
                      borderRadius: '8px 8px 0 0',
                      padding: '4px',
                      width: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <Typography>{task.date}</Typography>
                  </Box>

                  <Box sx={{ paddingTop: '40px' }}>
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
                    }}
                  />
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
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Darker box for the date that takes up full width and aligns to the top */}
                  <Box
                    sx={{
                      backgroundColor: '#DD5656',
                      borderRadius: '8px 8px 0 0',
                      padding: '4px',
                      width: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <Typography>{task.date}</Typography>
                  </Box>

                  <Box sx={{ paddingTop: '40px' }}>
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
                    }}
                  />
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
                    backgroundColor: 'secondary.light',
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
                      backgroundColor: 'secondary.dark',
                      borderRadius: '8px 8px 0 0',
                      padding: '4px',
                      width: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <Typography>{task.date}</Typography>
                  </Box>

                  <Box sx={{ paddingTop: '40px' }}>
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
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Done Tasks */}
          <Typography variant="h5" sx={{ marginTop: '32px', marginBottom: '16px', color: '#000' }}>
            Today's Completed Tasks
          </Typography>
          <Grid container spacing={2}>
            {doneTasks.map((task, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    padding: '16px',
                    backgroundColor: 'primary.light',
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
                      backgroundColor: 'primary.dark',
                      borderRadius: '8px 8px 0 0',
                      padding: '4px',
                      width: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <Typography>{task.date}</Typography>
                  </Box>

                  <Box sx={{ paddingTop: '40px' }}>
                    <Typography>{task.taskName}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Plants Section */}
          <Typography variant="h5" sx={{ marginTop: '32px', marginBottom: '16px', color: '#000' }}>
            Your Plants
          </Typography>

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

          <Grid container spacing={2}>
            {plants.length > 0 ? (
              plants.map((plant, index) => {
                const imageSrc = plant.imageFile && !plant.imageURL ? plant.imageFile : plant.imageURL;

                return (
                  <Grid item key={index} xs={6} sm={4} md={3}>
                    <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={plant.name}
                          style={{ width: '200px', height: '200px', border: '2px solid #B41878', objectFit: 'cover', objectPosition: 'center' }}
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
        </>
      )}
    </Box>
  );
}
