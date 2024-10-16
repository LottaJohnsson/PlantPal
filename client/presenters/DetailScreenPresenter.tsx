import React, {useEffect, useState} from 'react'
import DetailsScreenView from "../views/DetailScreenView";
import {useNavigate} from "react-router-dom";
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {fetchCareAdvice} from '../redux/slices/careAdviceSlice';
import {setUploadPlant} from "../redux/slices/plantSlice";

export default function DetailScreenPresenter() {
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate();
    const plant = useAppSelector(state => state.plant)
    const careAdvice = useAppSelector(state => state.careAdvice)
    const dispatch = useAppDispatch();

    function handleTabChange(event: React.SyntheticEvent, tabindex: number) {
        setTabIndex(tabindex);
    }

    function onAddToProfile() {
        dispatch(setUploadPlant(plant.currentPlant));
        navigate(`/upload`);   
    }


    return (
        <DetailsScreenView
            advice={careAdvice}
            species={plant}
            handleTabChange={handleTabChange}
            tabIndex={tabIndex}
            onAddToProfile={onAddToProfile}/>

    );
}