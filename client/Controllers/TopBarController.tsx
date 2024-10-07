import React, {useEffect, useState} from 'react'
import TopBar from '../components/TopBar'
import {useNavigate} from "react-router-dom";


export default function TopBarController() {
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const isLoggedIn = false;

    function buttonClick(page: string) {
        navigate('/' + page);

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
            const response = await fetch(`plant/search?query=${encodeURIComponent(query)}`, {
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
        <TopBar buttonClick={buttonClick} onInputChange={onInPutChange} isLoggedIn={isLoggedIn} data={data}
                onOptionClick={onOptionClick}/>
    )


}