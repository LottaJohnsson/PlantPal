import React, {useEffect, useState} from 'react'
import GeneralScreenView from "../Views/GeneralScreenView";
import {getCareAdvice, searchSpecies} from "../../server/models/plantModel";
import TopBarPresenter from "./TopBarPresenter";
import {useNavigate} from "react-router-dom";
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {fetchCareAdvice} from '../redux/slices/careAdviceSlice';

type Props = {}

//Get search result from Explore Page
export default function DetailScreenPresenter({}: Props) {
    const [tabIndex, setTabIndex] = useState(0);
    const [advice, setAdvice] = useState(null);
    const [species, setSpecies] = useState(null);
    const [query, setQuery] = useState<URLSearchParams>()
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const plant = useAppSelector(state => state.plant)
    const careAdvice = useAppSelector(state => state.careAdvice)

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