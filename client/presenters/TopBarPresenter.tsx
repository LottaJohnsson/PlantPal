import React, {useState} from 'react'
import TopBar from '../components/TopBar'
import {useNavigate} from "react-router-dom";
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {fetchPlants} from '../redux/slices/plantSlice'
import {setCurrentPlant} from '../redux/slices/plantSlice'
import {Plant} from '../redux/slices/plantSlice';
import axios from 'axios';
import {fetchCareAdvice} from "../redux/slices/careAdviceSlice";
import Popup from "../components/PopUp";
import {logoutUserR} from "../redux/slices/authSlice";

export default function TopBarPresenter() {
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const [openPopUp, setOpenPopUp] = useState(false)

    const auth = useAppSelector(state => state.auth)
    
    function buttonClick(page: string) {
        if (page == "logout") {
            dispatch(logoutUserR());
            navigate('/explore')
            setOpenPopUp(true)
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
        <>
            <TopBar
                buttonClick={buttonClick}
                isAuthenticated={auth.isAuthenticated}
                onInputChange={onInPutChange}
                data={data}
                onOptionClick={onOptionClick}
            />
            <Popup open={openPopUp} handleClose={() => setOpenPopUp(false)}></Popup>
        </>
    )


}