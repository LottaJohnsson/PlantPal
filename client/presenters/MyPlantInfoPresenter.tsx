import React, { useEffect, useState } from 'react'
import MyPlantInfoView from '../Views/MyPlantInfoView'
import { usePlant } from '../Contexts/plantContext';
import { UserPlant, Task, fetchUserPlantsFromDB, generateTasks, removePlantFromDB, completeTask, updatePlantInDB } from '../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPlants, setCurrentPlant } from '../redux/slices/plantSlice';
import { fetchCareAdvice } from '../redux/slices/careAdviceSlice';
import { useNavigate } from 'react-router-dom';
import Popup from "../components/PopUp";

type Props = {}

export default function MyPlantInfoPresenter({}: Props) {
  // const [advice, setAdvice] = useState<CareAdvice>()
  // const [species, setSpecies] = useState<Plant>()
  // const {search, fetchPlants, fetchTasks} = usePlant()
  const [tabIndex, setTabIndex] = useState(0)
  const [plant, setPlant] = useState<UserPlant>()
  const [lateTasks, setLateTasks] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])

  const [openPopUp, setOpenPopUp] = useState(false)

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

  // STANNA HÄR //

  const navigate = useNavigate();

  // Called at the start
  useEffect(() => {
    fetchPlantData();
  }, [])

  useEffect(() => {
    console.log("UserPlant changed")
    console.log(JSON.stringify(userPlants[0]))
    console.log(plant_name)
    console.log(JSON.stringify(userPlants.find((plant) => JSON.stringify(plant.name.trim) === JSON.stringify(plant_name?.trim))))
    const curPlant = userPlants.find((plant) => JSON.stringify(plant.name.trim) === JSON.stringify(plant_name?.trim))
    setPlant(curPlant)
  }, [userPlants])

  useEffect(() => {
    console.log("Plant changed")
    console.log(JSON.stringify(plant))
    fetchSpeciesData()
  }, [plant])

  // Called when there is a change in userTasksToday, userTasksLate, userTasksUpcoming or userTasksDone
  useEffect(() => {
    setLateTasks(userTasksLate);
    setUpcomingTasks(userTasksToday.concat(userTasksUpcoming));
    setDoneTasks(userTasksDone);

  }, [userTasksToday, userTasksLate, userTasksUpcoming, userTasksDone])

  useEffect(() => {
    console.log("Advice")
    console.log(JSON.stringify(advice))
  }, [advice, species])

  const fetchPlantData = async () => {
    if (userPlants.length === 0) {
      await dispatch(fetchUserPlantsFromDB())
      dispatch(generateTasks())
    } else {
      const curPlant = userPlants.find((plant) => JSON.stringify(plant.name.trim) === JSON.stringify(plant_name?.trim))
      setPlant(curPlant)
    }

    if (plant_name) {
    } else {
      throw new Error("Missing plant name");
    }
  }

  const fetchSpeciesData = async () => {
    const curPlant = userPlants.find((plant) => JSON.stringify(plant.name.trim) === JSON.stringify(plant_name?.trim))
    setPlant(curPlant)

    console.log("fetching species data")

    console.log("Species, advice, plant")
    console.log(JSON.stringify(species))
    console.log(JSON.stringify(advice))
    console.log(JSON.stringify(curPlant))

    if (curPlant?.id.length !== 0 && curPlant !== undefined) {
      console.log('Plant has id: %s', curPlant.id)

      if (curPlant.id !==species.currentPlant?.id) {
        console.log("Id does not matched saved species")

        try {
          console.log("Try to fetch specific species info through id")
          const response = await fetch(`plants/search?query=${encodeURIComponent(curPlant.name)}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          });

          const json = await response.json();
          console.log("received result");
          console.log(response.status)
          console.log(JSON.stringify(json))
          const currentPlant = json.result[0];

          console.log("Current plant and current plant id")
          console.log(currentPlant)
          console.log(currentPlant.id)

          dispatch(setCurrentPlant(currentPlant))
          dispatch(fetchCareAdvice(currentPlant.id))
        } catch (error) {
          console.error("Error fetching species data in fetchSpeciesData():", error);
        }
      } else {
        console.log("Id does match current save species")
      }
    }

    /* if (id && name) {
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
    } */
  }

  function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
    setTabIndex(tabindex);
  }

  const onRemoveFromProfile = async () => {
    if(plant) {
      console.log('remove plant: %s',plant.name)
      await dispatch(removePlantFromDB(plant.name))
      setOpenPopUp(true)
    } else {
      console.error("Cannot find plant")
    }
  }

  function handlePopupClose() {
    setOpenPopUp(false)
    console.log("Close popup")
    navigate('/profile')
  } 

  const onCompleteTask = async (completedTask: Task) => {
    dispatch(completeTask(completedTask));
    // update db also
    await dispatch(updatePlantInDB(completedTask.plantName));
  }

  return (
    <>
      <MyPlantInfoView 
        species={species} 
        advice={advice} 
        plant={plant}
        upcomingTasks={upcomingTasks}
        lateTasks={lateTasks}
        doneTasks={doneTasks}
        handleTabChange={handleTabChange} 
        tabIndex={tabIndex} 
        onRemoveFromProfile={onRemoveFromProfile}
        onCompleteTask={onCompleteTask}
      />
      <Popup.RemovePlantPopUp open={openPopUp} handleClose={handlePopupClose}></Popup.RemovePlantPopUp>
    </>
  )
}