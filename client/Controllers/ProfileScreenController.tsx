import React, { useState, useEffect } from 'react';
import ProfileScreenView from '../Views/ProfileScreenView';
import { useNavigate } from 'react-router-dom';
import { usePlant, Plant } from '../Contexts/plantContext';

type Props = {};

export default function ProfileScreenController({}: Props) {
  type Task = {
    date: string;
    taskName: string;
  };

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [lateTasks, setLateTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 
  const { fetchPlants } = usePlant();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayTasks();
    fetchLateTasks();
    fetchUpcomingTasks();
    onFetchPlants();
  }, []);

  const fetchTodayTasks = () => {
    setTodayTasks([
      { date: 'Today 29/9', taskName: 'Water Cactus' },
      { date: 'Today 29/9', taskName: 'Water Flower' },
    ]);
  };

  const fetchLateTasks = () => {
    setLateTasks([
      { date: 'Today 29/9', taskName: 'Water Cactus' },
      { date: 'Today 29/9', taskName: 'Water Flower' },
    ]);
  };

  const fetchUpcomingTasks = () => {
    setUpcomingTasks([
      { date: 'Tomorrow 30/9', taskName: 'Water Cactus' },
      { date: '5/10', taskName: 'Water Cactus' },
      { date: '10/10', taskName: 'Water Cactus' },
      { date: '11/10', taskName: 'Water Cactus' },
    ]);
  };

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
