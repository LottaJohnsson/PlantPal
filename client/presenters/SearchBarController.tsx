import React, {useEffect, useState} from 'react'
import SearchBar from '../components/SearchBar'
import {useNavigate} from "react-router-dom";
import { usePlant } from '../Contexts/plantContext';

export default function SearchBarController() {
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const {search} = usePlant();


    async function onInPutChange(query: string) {
        const data = await search(query);
        setData(data);
    }

    function onOptionClick(id: string, name: string) {
        if (id) {
            navigate(`/generalinfo?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`,);
        }
    }

    return (
        <SearchBar onInputChange={onInPutChange} data={data} onOptionClick={onOptionClick}/>
    )
}
