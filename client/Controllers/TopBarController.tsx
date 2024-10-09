import React from 'react'
import TopBar from '../components/TopBar'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Contexts/authContext";

export default function TopBarController() {
    const navigate = useNavigate();
    const isLoggedIn = false;
    const authContext = useAuth()


    function buttonClick(page: string) {
        if (page == "logout") {
            authContext.logoutUser();
            navigate('/explore')
        } else {
            navigate('/' + page);
        }

    }

    return (
        <TopBar buttonClick={buttonClick} isAuthenticated={authContext.isAuthenticated}/>
    )


}