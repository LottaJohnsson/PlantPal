import React, {useEffect, useState} from 'react'
import TopBar from '../components/TopBar'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Contexts/authContext";
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {fetchPlants} from '../redux/slices/plantSlice'
import {setCurrentPlant} from '../redux/slices/plantSlice'
import {Plant} from '../redux/slices/plantSlice';
import axios from 'axios';
import {fetchCareAdvice} from "../redux/slices/careAdviceSlice";

export default function TopBarController() {
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const isLoggedIn = false;
    const authContext = useAuth()
    const dispatch = useAppDispatch()

    function buttonClick(page: string) {
        if (page == "logout") {
            authContext.logoutUser();
            navigate('/explore')
        } else {
            navigate('/' + page);
        }

    }

    function onOptionClick(plant: Plant) {
        dispatch(setCurrentPlant(plant))
        dispatch(fetchCareAdvice(plant.id))
        navigate(`/generalinfo`,);
    }


    async function onInPutChange(query: string) {
        const data = await search(query);
        console.log(data)
        setData(data);
    }


    const search = async (query: string) => {

        try {
            const response = await fetch(`plants/search?query=${encodeURIComponent(query)}`, {
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
        <TopBar buttonClick={buttonClick} onInputChange={onInPutChange} isAuthenticated={authContext.isAuthenticated}
                data={data}
                onOptionClick={onOptionClick}/>
    )

}