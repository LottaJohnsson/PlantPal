import React, {useEffect, useState} from 'react'
import GeneralScreenView from "../views/GeneralScreenView";
import {getCareAdvice, searchSpecies} from "../../server/models/plantModel";
import TopBarPresenter from "./TopBarPresenter";
import {useNavigate} from "react-router-dom";
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {fetchCareAdvice} from '../redux/slices/careAdviceSlice';

export default function DetailScreenPresenter() {
    const [tabIndex, setTabIndex] = useState(0);
    const [query, setQuery] = useState<URLSearchParams>()
    const navigate = useNavigate();
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
                advice={careAdvice}
                species={plant}
                handleTabChange={handleTabChange}
                tabIndex={tabIndex}
                onAddToProfile={onAddToProfile}/>
        </>
    );
}