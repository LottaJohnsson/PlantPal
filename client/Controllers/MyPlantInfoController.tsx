import React, { useEffect, useState } from 'react'
import MyPlantInfoView from '../Views/MyPlantInfoView'
import { usePlant, Plant, Task } from '../Contexts/plantContext';

type Props = {}

export default function MyPlantInfoController({}: Props) {
  const [advice, setAdvice] = useState(null)
  const [species, setSpecies] = useState(null)
  const {search, fetchPlants, fetchTasks} = usePlant()
  const [tabIndex, setTabIndex] = useState(0)
  const [plant, setPlant] = useState<Plant>()
  const [lateTasks, setLateTasks] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])

  const queryParams = new URLSearchParams(window.location.search)

  useEffect(() => {
      fetchPlant().then(fetchPlantTasks).catch((error) => console.log('Error fetching plant data:', error));
      fetchData();
  }, []); // Empty dependency array to run on mount only



  const fetchPlant = async () => {
    const plant_id = queryParams.get('plantid')
  
    if (plant_id) {
      try {
        const plantsData = await fetchPlants()
        const plantData = plantsData.find((plant) => plant.id === plant_id)
  
        setPlant(plantData)
        
      } catch (error) {
        console.error('Error fetching plant data:', error)
      }
  
    } else {
      throw new Error("Missing plant id");
    }
  }

  const fetchData = async () => {
    const id = queryParams.get('id')
    const name = queryParams.get('name')

    if (id && name) {
        try {
            const speciesData = await search(name); // Assuming search is defined elsewhere
            const adviceData = await careAdvice(id); // Assuming careAdvice is defined elsewhere

            setSpecies(speciesData);
            setAdvice(adviceData);

        } catch (error) {
            console.error('Error fetching species data:', error);
        }
    }
};

  const careAdvice = async (query: string) => {
    try {
        const response = await fetch(`plants/care_advice?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const json = await response.json();
        return json.result;

    } catch (error) {
        console.error("Error during search:", error);
        return null;
    }
  };

  function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
    setTabIndex(tabindex);
  }

  const fetchPlantTasks = async () => {
    try {
      const fetchedTasks = await fetchTasks()

      const lateTasks = fetchedTasks.filter((task) => task.type === 'late')
      setLateTasks(lateTasks);

      const upcomingTasks = fetchedTasks.filter((task) => task.type === 'upcoming' || task.type === 'today')
      setUpcomingTasks(upcomingTasks);

      const doneTasks = fetchedTasks.filter((task) => task.type === 'done');
      setDoneTasks(doneTasks); // Filter for done tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  function onRemoveFromProfile() {
    
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