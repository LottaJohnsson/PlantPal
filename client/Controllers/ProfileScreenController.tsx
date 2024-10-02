import React, { useState, useEffect } from 'react';
import ProfileScreenView from '../Views/ProfileScreenView';

type Props = {};

export default function ProfileScreenController({}: Props) {
  type Task = {
    date: string;
    taskName: string;
  };

  type Plant = {
    name: string;
    image: string;
  };

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [lateTasks, setLateTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    fetchTodayTasks();
    fetchLateTasks();
    fetchUpcomingTasks();
    fetchPlants();
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

  const fetchPlants = () => {
    setPlants([
      { name: 'Flower', image: 'general_info.png' },
    ]);
  };

  const handleAddNewPlant = () => {
    console.log('Add new plant clicked');
  };

  return (
    <ProfileScreenView 
      todayTasks={todayTasks}
      lateTasks={lateTasks}
      upcomingTasks={upcomingTasks}
      plants={plants}
      onAddNewPlant={handleAddNewPlant}
    />
  );
}
