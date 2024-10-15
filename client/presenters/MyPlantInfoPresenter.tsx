import React, { useEffect, useState } from 'react'
import MyPlantInfoView from '../Views/MyPlantInfoView'
import { usePlant } from '../Contexts/plantContext';
import { UserPlant, Task, fetchUserPlantsFromDB, generateTasks, removePlantFromDB, completeTask, updatePlantInDB } from '../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Plant, setCurrentPlant } from '../redux/slices/plantSlice';
import { CareAdvice, fetchCareAdvice } from '../redux/slices/careAdviceSlice';
import { useNavigate } from 'react-router-dom';
import Popup from "../components/PopUp";

type Props = {}

export default function MyPlantInfoPresenter({}: Props) {
  const [advice, setAdvice] = useState<CareAdvice>()
  const [species, setSpecies] = useState<Plant>()
  const [tabIndex, setTabIndex] = useState(0)
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

  const plantspecies = useAppSelector(state => state.plant)
  const careadvice = useAppSelector(state => state.careAdvice)

  const queryParams = new URLSearchParams(window.location.search)
  const plantName = queryParams.get('plantname')

  // STANNA HÄR

  const navigate = useNavigate();

  // Called at the start
  useEffect(() => {
    fetchPlantData();
  }, [])

  useEffect(() => {
    fetchSpeciesData()
  }, [userPlants])

  // Called when there is a change in userTasksToday, userTasksLate, userTasksUpcoming or userTasksDone
  useEffect(() => {
    setLateTasks(userTasksLate);
    setUpcomingTasks(userTasksToday.concat(userTasksUpcoming));
    setDoneTasks(userTasksDone);

  }, [userTasksToday, userTasksLate, userTasksUpcoming, userTasksDone])

  const fetchPlantData = async () => {
    if (plantName) {
      if (userPlants.length === 0) {
        await dispatch(fetchUserPlantsFromDB())
        dispatch(generateTasks())
      }

    } else {
      throw new Error("Missing plant name");
    }
  }

  const fetchSpeciesData = async () => {
    const plant = userPlants.find((plant) => JSON.stringify(plant.name.trim()) === JSON.stringify(plantName?.trim()))

    if (plant?.id.length !== 0 && plant !== undefined) {
      console.log('Plant has id: %s', plant.id)

      if (plant.id !==plantspecies.currentPlant?.id) {
        console.log("Id does not matched saved species")

        try {
          console.log("Try to fetch specific species info through id")
          const response = await fetch(`plants/search?query=${encodeURIComponent(plant.name)}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          });

          const json = await response.json();
          const currentPlant = json.result[0];

          dispatch(setCurrentPlant(currentPlant))
          dispatch(fetchCareAdvice(currentPlant.id))
        } catch (error) {
          console.error("Error fetching species data in fetchSpeciesData():", error);
        }
      } else {
        console.log("Id does match current save species")
      }
    }
  }

  function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
    setTabIndex(tabindex);
  }

  const onRemoveFromProfile = async () => {
    const plant = userPlants.find((plant) => JSON.stringify(plant.name.trim()) === JSON.stringify(plantName?.trim()))
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
        species={plantspecies} 
        advice={careadvice} 
        plant={userPlants.find((plant) => JSON.stringify(plant.name.trim()) === JSON.stringify(plantName?.trim()))}
        upcomingTasks={upcomingTasks}
        lateTasks={lateTasks}
        doneTasks={doneTasks}
        handleTabChange={handleTabChange} 
        tabIndex={tabIndex} 
        onRemoveFromProfile={onRemoveFromProfile}
        onCompleteTask={onCompleteTask}
      />
      <Popup.PopUp open={openPopUp} handleClose={handlePopupClose} header="Removed Plant" message="You have successfully removed the plant"></Popup.PopUp>
    </>
  )
}