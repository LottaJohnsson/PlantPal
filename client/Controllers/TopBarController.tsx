import React, {useState} from 'react'
import TopBar from '../components/TopBar'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Contexts/authContext";
import Popup from "../components/Popup";

export default function TopBarController() {
    const navigate = useNavigate();
    const isLoggedIn = false;
    const authContext = useAuth()
    const [openPopUp, setOpenPopUp] = useState(false)


    function buttonClick(page: string) {
        if (page == "logout") {
            authContext.logoutUser();
            setOpenPopUp(true);
            navigate('/explore')
        } else {
            navigate('/' + page);
        }
    }

    return (
        <>
            <TopBar buttonClick={buttonClick} isAuthenticated={authContext.isAuthenticated}/>
            <Popup open={openPopUp} handleClose={() => setOpenPopUp(false)}></Popup>
        </>
    )

}