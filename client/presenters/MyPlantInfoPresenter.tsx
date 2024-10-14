import React, { useEffect, useState } from 'react'
import MyPlantInfoView from '../Views/MyPlantInfoView'
import { usePlant } from '../Contexts/plantContext';
import { UserPlant, Task, fetchUserPlantsFromDB, generateTasks, removePlantFromDB } from '../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPlants, setCurrentPlant } from '../redux/slices/plantSlice';
import { fetchCareAdvice } from '../redux/slices/careAdviceSlice';
import { useNavigate } from 'react-router-dom';

type Props = {}

export default function MyPlantInfoPresenter({}: Props) {
  // const [advice, setAdvice] = useState(null)
  // const [species, setSpecies] = useState(null)
  // const {search, fetchPlants, fetchTasks} = usePlant()
  const [tabIndex, setTabIndex] = useState(0)
  const [plant, setPlant] = useState<UserPlant>()
  const [lateTasks, setLateTasks] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])

  // Redux
  const dispatch = useAppDispatch()
  const userPlants = useAppSelector(state => state.task.userPlants)
  const userTasksToday = useAppSelector(state => state.task.userTasksToday)
  const userTasksLate = useAppSelector(state => state.task.userTasksLate)
  const userTasksUpcoming = useAppSelector(state => state.task.userTasksUpcoming)
  const userTasksDone = useAppSelector(state => state.task.userTasksDone)

  const species = useAppSelector(state => state.plant)
  const advice = useAppSelector(state => state.careAdvice)

  const queryParams = new URLSearchParams(window.location.search)
  const plant_name = queryParams.get('plantname')

  const navigate = useNavigate();

  // Called at the start
  useEffect(() => {
    fetchPlantData();
    // fetchSpeciesData();
  }, [])

  // Called when there is a change in userTasksToday, userTasksLate, userTasksUpcoming or userTasksDone
  useEffect(() => {
    setPlant(userPlants.find((plant) => plant.name === plant_name))
    setLateTasks(userTasksLate);
    setUpcomingTasks(userTasksToday.concat(userTasksUpcoming));
    setDoneTasks(userTasksDone);

  }, [userPlants, userTasksToday, userTasksLate, userTasksUpcoming, userTasksDone])

  useEffect(() => {
    

  }, [species, advice])


  const fetchPlantData = async () => {
    if (userPlants.length === 0) {
      await dispatch(fetchUserPlantsFromDB())
      dispatch(generateTasks())
    }

    if (plant_name) {
    } else {
      throw new Error("Missing plant name");
    }
  }

  const fetchSpeciesData = async () => {
    const id = queryParams.get('id')
    const name = queryParams.get('name')

    console.log("fetching species data")

    if (id && name) {
      console.log("ID and Name in url")
      if (id !== species.currentPlant?.id ) {
        console.log("Id does not matched saved species")
        try {
          const response = await fetch(`plants/search?query=${encodeURIComponent(name)}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          });

          const json = await response.json();
          console.log("received result");
          const currentPlant = json.result[0];

          console.log(currentPlant)

          dispatch(setCurrentPlant(currentPlant[0]))
          dispatch(fetchCareAdvice(currentPlant[0].id))
        } catch (error) {
          console.error("Error fetching species data in fetchSpeciesData():", error);
        }
      }
    }
  }

  function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
    setTabIndex(tabindex);
  }

  const onRemoveFromProfile = async () => {
    if(plant) {
      console.log('remove plant: %s',plant.name)
      await dispatch(removePlantFromDB(plant.name))
      navigate('/profile')
    } else {
      console.error("Cannot find plant")
    }
  }

  return (
    <MyPlantInfoView 
      species={species} 
      advice={advice} 
      plant={plant}
      upcomingTasks={upcomingTasks}
      lateTasks={lateTasks}
      doneTasks={doneTasks}
      handleTabChange={handleTabChange} 
      tabIndex={tabIndex} 
      onRemoveFromProfile={onRemoveFromProfile}/>
  )
}