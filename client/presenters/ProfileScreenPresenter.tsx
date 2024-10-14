import React, { useState, useEffect } from 'react';
import ProfileScreenView from '../views/ProfileScreenView';
import { useNavigate } from 'react-router-dom';
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {UserPlant, Task, completeTask} from '../redux/slices/userSlice'
import { fetchUserPlantsFromDB, generateTasks, updatePlantInDB } from '../redux/slices/userSlice';


export default function ProfileScreenController() {

  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 
  //const { fetchPlants, fetchTasks } = usePlant();
  const navigate = useNavigate();
  //const [tasks, setTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [lateTasks, setLateTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]); // New state for done tasks

  // redux
  const dispatch = useAppDispatch();
  const userPlants = useAppSelector(state => state.task.userPlants);
  const userTasksToday = useAppSelector(state => state.task.userTasksToday);
  const userTasksLate = useAppSelector(state => state.task.userTasksLate);
  const userTasksUpcoming = useAppSelector(state => state.task.userTasksUpcoming);
  const userTasksDone = useAppSelector(state => state.task.userTasksDone);

  useEffect(() => {
    setPlants(userPlants);
    setTodayTasks(userTasksToday);
    setLateTasks(userTasksLate);
    setUpcomingTasks(userTasksUpcoming);
    setDoneTasks(userTasksDone);

  }, [userPlants, userTasksToday, userTasksLate, userTasksUpcoming, userTasksDone]);

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
    // update db also
    await dispatch(updatePlantInDB(completedTask.plantName));
  };

  return (
    <ProfileScreenView
      todayTasks={todayTasks}
      lateTasks={lateTasks}
      upcomingTasks={upcomingTasks}
      doneTasks={doneTasks}
      plants={plants}
      onAddNewPlant={handleAddNewPlant}
      loading={loading}
      onCompleteTask={onCompleteTask}
    />
  );
}
