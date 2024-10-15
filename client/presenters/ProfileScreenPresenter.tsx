import React, { useState, useEffect } from 'react';
import ProfileScreenView from '../Views/ProfileScreenView';
import { useNavigate } from 'react-router-dom';
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {UserPlant, Task, completeTask} from '../redux/slices/userSlice'
import { fetchUserPlantsFromDB, generateTasks, updatePlantInDB } from '../redux/slices/userSlice';


export default function ProfileScreenController() {

  const [loading, setLoading] = useState<boolean>(false); 
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userPlants = useAppSelector(state => state.task.userPlants);
  const userTasksToday = useAppSelector(state => state.task.userTasksToday);
  const userTasksLate = useAppSelector(state => state.task.userTasksLate);
  const userTasksUpcoming = useAppSelector(state => state.task.userTasksUpcoming);
  const userTasksDone = useAppSelector(state => state.task.userTasksDone);

  // Fetch user plants and generate tasks
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchUserPlantsFromDB());
      dispatch(generateTasks());
      setLoading(false);
    };
    fetchData();
  }, []);


  const handleAddNewPlant = () => {
    navigate('/upload');
  };

  const onCompleteTask = async (completedTask: Task) => {
    dispatch(completeTask(completedTask));
    await dispatch(updatePlantInDB(completedTask.plantName));
  };

  const navigatToPlant = (plant: UserPlant) => {
    const params = new URLSearchParams({
      plantname: plant.name,
    });
    
    navigate('/myplant?'.concat(params.toString()))
  }

  return (
    <ProfileScreenView
      todayTasks={userTasksToday}
      lateTasks={userTasksLate}
      upcomingTasks={userTasksUpcoming}
      doneTasks={userTasksDone}
      plants={userPlants}
      onAddNewPlant={handleAddNewPlant}
      loading={loading}
      onCompleteTask={onCompleteTask}
      onClickPlant={navigatToPlant}
    />
  );
}
