import React, {useEffect, useState} from 'react'
import GeneralScreenView from "../Views/GeneralScreenView";
import {getCareAdvice, searchSpecies} from "../../server/Models/plantModel";
import TopBarController from "./TopBarController";
import { usePlant } from '../Contexts/plantContext';

type Props = {}

//Get search result from Explore Page
export default function GeneralScreenController({}: Props) {
    const [tabIndex, setTabIndex] = useState(0);
    const [advice, setAdvice] = useState(null);
    const [species, setSpecies] = useState(null);

    const [queryValue, setQueryValue] = useState<string>();
    const {search} = usePlant();

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

    function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
        setTabIndex(tabindex);
    }

    function onAddToProfile() {
        console.log("Add to profile");
        //TODO
    }
    
    const careAdvice = async (query: string) => {
        try {
            const response = await fetch(`plant/care_advice?query=${encodeURIComponent(query)}`, {
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

    return (
        <>
            <GeneralScreenView
                advice={advice}
                species={species}
                handleTabChange={handleTabChange}
                tabIndex={tabIndex}
                onAddToProfile={onAddToProfile}/>
        </>
    );
}