import React, { useState, useEffect } from 'react';
import ProfileScreenView from '../Views/ProfileScreenView';
import { useNavigate } from 'react-router-dom';
import { usePlant, Plant, Task } from '../Contexts/plantContext';

type Props = {};

export default function ProfileScreenController({}: Props) {

  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 
  const { fetchPlants, fetchTasks } = usePlant();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [lateTasks, setLateTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    onFetchTasks();
    onFetchPlants();
  }, []);

  // const fetchTodayTasks = () => {
  //   setTodayTasks([
  //     { date: 'Today 29/9', taskName: 'Water Cactus' },
  //     { date: 'Today 29/9', taskName: 'Water Flower' },
  //   ]);
  // };

  // const fetchLateTasks = () => {
  //   setLateTasks([
  //     { date: 'Today 29/9', taskName: 'Water Cactus' },
  //     { date: 'Today 29/9', taskName: 'Water Flower' },
  //   ]);
  // };

  // const fetchUpcomingTasks = () => {
  //   setUpcomingTasks([
  //     { date: 'Tomorrow 30/9', taskName: 'Water Cactus' },
  //     { date: '5/10', taskName: 'Water Cactus' },
  //     { date: '10/10', taskName: 'Water Cactus' },
  //     { date: '11/10', taskName: 'Water Cactus' },
  //   ]);
  // };


  const onFetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);

      // todays tasks are tasks with type 'today'
      const todayTasks = fetchedTasks.filter((task) => task.type === 'today');
      setTodayTasks(todayTasks);

      // late tasks are tasks with type 'late'
      const lateTasks = fetchedTasks.filter((task) => task.type === 'late');
      setLateTasks(lateTasks);

      // upcoming tasks are tasks with type 'upcoming'
      const upcomingTasks = fetchedTasks.filter((task) => task.type === 'upcoming');
      setUpcomingTasks(upcomingTasks);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  const onFetchPlants = async () => {
    setLoading(true); 
    try {
      const fetchedPlants = await fetchPlants();
      setPlants(fetchedPlants);
      console.log(fetchedPlants);
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewPlant = () => {
    navigate('/upload');
  };

  return (
    <ProfileScreenView
      todayTasks={todayTasks}
      lateTasks={lateTasks}
      upcomingTasks={upcomingTasks}
      plants={plants}
      onAddNewPlant={handleAddNewPlant}
      loading={loading}
    />
  );
}
