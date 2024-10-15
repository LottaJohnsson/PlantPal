import React, { useEffect, useState } from 'react'
import MyPlantInfoView from '../Views/MyPlantInfoView'
import { Task, fetchUserPlantsFromDB, generateTasks, removePlantFromDB, completeTask, updatePlantInDB } from '../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Plant, setCurrentPlant } from '../redux/slices/plantSlice';
import { CareAdvice, fetchCareAdvice } from '../redux/slices/careAdviceSlice';
import { useNavigate } from 'react-router-dom';
import Popup from "../components/PopUp";
import axios from 'axios';

type Props = {}

export default function MyPlantInfoPresenter({}: Props) {
  const [advice, setAdvice] = useState<CareAdvice>()
  const [species, setSpecies] = useState<Plant>()
  const [tabIndex, setTabIndex] = useState(0)
  const [lateTasks, setLateTasks] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [paramExists, setParamExist] = useState<boolean>(true)

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
      setParamExist(false)
    }
  }

  const fetchSpeciesData = async () => {
    const plant = userPlants.find((plant) => JSON.stringify(plant.name.trim()) === JSON.stringify(plantName?.trim()))

    if (plant?.id.length !== 0 && plant !== undefined) {

      if (plant.id !==plantspecies.currentPlant?.id) {

        try {

          const response = await axios.get(`plants/search?query=${encodeURIComponent(plant.api_name)}`);
          dispatch(setCurrentPlant(await response.data.data[0]))
          dispatch(fetchCareAdvice(await response.data.data[0].id))

        } catch (error) {
        }
      }
    }
  }

  function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
    setTabIndex(tabindex);
  }

  const onRemoveFromProfile = async () => {
    const plant = userPlants.find((plant) => JSON.stringify(plant.name.trim()) === JSON.stringify(plantName?.trim()))
    if(plant) {
      await dispatch(removePlantFromDB(plant.name))
      setOpenPopUp(true)
    } else {
      console.error("Cannot find plant")
    }
  }

  function handlePopupClose() {
    setOpenPopUp(false)
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
        paramExists={paramExists}
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