import React, {useEffect, useState} from 'react'
import GeneralScreenView from "../Views/GeneralScreenView";
import {getCareAdvice, searchSpecies} from "../../server/Models/plantModel";

type Props = {}

//Get search result from Explore Page
export default function GeneralScreenController({}: Props) {
    const [tabIndex, setTabIndex] = useState(0)
    const [advice, setAdvice] = useState(null);
    const [species, setSpecies] = useState(null);

    function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
        setTabIndex(tabindex);
    }

    function onAddToProfile() {
        console.log("Add to profile");
        //TODO
    }

    //Should be done from Explore Page
    useEffect(() => {
        searchSpecies("Aloe").then(res => {
            setSpecies(res[0]);
        })
        getCareAdvice("Aloe").then(res => {
            setAdvice(res[0]);
        })
    }, []);

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