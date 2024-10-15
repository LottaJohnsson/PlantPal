import React, {useState} from 'react'
import TopBar from '../components/TopBar'
import {useNavigate} from "react-router-dom";
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {fetchPlants} from '../redux/slices/plantSlice'
import {setCurrentPlant} from '../redux/slices/plantSlice'
import {Plant} from '../redux/slices/plantSlice';
import axios from 'axios';
import {fetchCareAdvice} from "../redux/slices/careAdviceSlice";
import PopUp from "../components/Popup";
import {logoutUserR} from "../redux/slices/authSlice";
import {persistor} from "../redux/store";
import {response} from "express";

export default function TopBarPresenter() {
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const [openPopUp, setOpenPopUp] = useState(false)
    const [popupMessage, setPopUpMessage] = useState<string>('')
    const [popupHeader, setPopUpHeader] = useState<string>('')

    const auth = useAppSelector(state => state.auth)

    function buttonClick(page: string) {
        if (page == "logout") {
            dispatch(logoutUserR());
            navigate('/')
            setPopUpMessage("You have been successfully logged out");
            setPopUpHeader("Logged out")
            setOpenPopUp(true)
            persistor.purge(); // This will clear all persisted data in localStorage

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
            const response = await axios.get(`plants/search?query=${encodeURIComponent(query)}`);
            return response.data.data;

        } catch (error: any) {
            setPopUpHeader("Error");
            setPopUpMessage(error.message)
            setOpenPopUp(true);
            return null;
        }
    };
    return (
        <>
            <TopBar
                buttonClick={buttonClick}
                isAuthenticated={auth.isAuthenticated}
                onInputChange={onInPutChange}
                data={data || []}
                onOptionClick={onOptionClick}
            />
            <PopUp.PopUp open={openPopUp} message={popupMessage} header={popupHeader}
                   handleClose={() => setOpenPopUp(false)}></PopUp.PopUp>
        </>
    )


}