import React, {useEffect, useState} from 'react'
import TopBar from '../components/TopBar'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Contexts/authContext";

export default function TopBarController() {
    const [data, setData] = useState([])
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

    function onOptionClick(id: string, name: string) {
        if (id) {
            navigate(`/generalinfo?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`,);
        }
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
        <TopBar buttonClick={buttonClick} onInputChange={onInPutChange} isAuthenticated={authContext.isAuthenticated}
                data={data}
                onOptionClick={onOptionClick}/>
    )


}