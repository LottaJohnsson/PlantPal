import React, { useEffect, useState } from 'react'
import MyPlantInfoView from '../Views/MyPlantInfoView'
import { usePlant } from '../Contexts/plantContext';

type Props = {}

export default function MyPlantInfoController({}: Props) {
  const [advice, setAdvice] = useState(null);
  const [species, setSpecies] = useState(null);
  const {search} = usePlant();
  const [tabIndex, setTabIndex] = useState(0);
  const [query, setQuery] = useState<URLSearchParams>()

  useEffect(() => {
      const fetchData = async () => {
          const queryParams = new URLSearchParams(window.location.search);
          const id = queryParams.get('id');
          const name = queryParams.get('name');

          if (id && name) {
              try {
                  const speciesData = await search(name); // Assuming search is defined elsewhere
                  const adviceData = await careAdvice(id); // Assuming careAdvice is defined elsewhere

                  setSpecies(speciesData);
                  setAdvice(adviceData);

              } catch (error) {
                  console.error('Error fetching data:', error);
              }
          }
      };

      fetchData(); // Call the async function
  }, []); // Empty dependency array to run on mount only

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

  function onRemoveFromProfile() {
    
  }

  return (
    <MyPlantInfoView species={species} advice={advice} handleTabChange={handleTabChange} tabIndex={tabIndex} onRemoveFromProfile={onRemoveFromProfile}/>
  )
}