import React, {useEffect, useState} from 'react'
import GeneralScreenView from "../Views/GeneralScreenView";
import {useNavigate} from "react-router-dom";
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {fetchCareAdvice} from '../redux/slices/careAdviceSlice';

type Props = {}

//Get search result from Explore Page
export default function GeneralScreenController({}: Props) {
    const [tabIndex, setTabIndex] = useState(0);
    const [query, setQuery] = useState<URLSearchParams>()
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const plant = useAppSelector(state => state.plant)
    const careAdvice = useAppSelector(state => state.careAdvice)

    console.log('plant ' + plant.currentPlant?.common_name)
    console.log('plant advice ' + careAdvice.careAdvice)
    useEffect(() => {
        if (plant.currentPlant && plant.currentPlant.id) {
            dispatch(fetchCareAdvice(plant.currentPlant.id))
        }
    }, []); // Empty dependency array to run on mount only

    function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
        setTabIndex(tabindex);
    }

    function onAddToProfile() {
        if (query != null) {
            const id = query.get('id') as string;
            const name = query.get('name') as string;

            navigate(`/upload?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`);
        }
    }

    return (
        <>
            <GeneralScreenView
                advice={careAdvice.careAdvice}
                species={plant.currentPlant}
                handleTabChange={handleTabChange}
                tabIndex={tabIndex}
                onAddToProfile={onAddToProfile}/>
        </>
    );
}