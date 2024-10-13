import React, { useState, useEffect } from 'react';
import ProfileScreenView from '../Views/ProfileScreenView';
import { useNavigate } from 'react-router-dom';
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {UserPlant, Task, updateTask} from '../redux/slices/userSlice'


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

  // useEffect(() => {
  //   onFetchTasks();
  //   onFetchPlants();
  // }, []);

  useEffect(() => {
    setPlants(userPlants);
    setTodayTasks(userTasksToday);
    setLateTasks(userTasksLate);
    setUpcomingTasks(userTasksUpcoming);
    setDoneTasks(userTasksDone);
  }, [userPlants, userTasksToday, userTasksLate, userTasksUpcoming, userTasksDone]);

  // const onFetchTasks = async () => {
  //   setLoading(true);
  //   try {
  //     const fetchedTasks = await fetchTasks();
  //     setTasks(fetchedTasks);

  //     const todayTasks = fetchedTasks.filter((task) => task.type === 'today');
  //     setTodayTasks(todayTasks);

  //     const lateTasks = fetchedTasks.filter((task) => task.type === 'late');
  //     setLateTasks(lateTasks);

  //     const upcomingTasks = fetchedTasks.filter((task) => task.type === 'upcoming');
  //     setUpcomingTasks(upcomingTasks);

  //     const doneTasks = fetchedTasks.filter((task) => task.type === 'done');
  //     setDoneTasks(doneTasks); // Filter for done tasks
  //   } catch (error) {
  //     console.error('Error fetching tasks:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // const onFetchPlants = async () => {
  //   setLoading(true); 
  //   try {
  //     const fetchedPlants = await fetchPlants();
  //     setPlants(fetchedPlants);
  //   } catch (error) {
  //     console.error('Error fetching plants:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddNewPlant = () => {
    navigate('/upload');
  };

  const onCompleteTask = (completedTask: Task) => {
    // // Update the task type to 'done' and update the state
    // const updatedTasks = tasks.map(task => 
    //   task.taskName === completedTask.taskName ? { ...task, type: 'done' } : task
    // );

    // setTasks(updatedTasks);
    // setTodayTasks(updatedTasks.filter((task) => task.type === 'today'));
    // setLateTasks(updatedTasks.filter((task) => task.type === 'late'));
    // setUpcomingTasks(updatedTasks.filter((task) => task.type === 'upcoming'));
    // setDoneTasks(updatedTasks.filter((task) => task.type === 'done'));

    dispatch(updateTask(completedTask));

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
