import React from 'react'
import TopBar from "../components/TopBar";
import {useEffect} from 'react'
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import {fetchPlants} from '../redux/slices/plantSlice'
import {setCurrentPlant} from '../redux/slices/plantSlice'
import Button from "@mui/material/Button";

type Props = {}


export default function HomeScreenView({}: Props) {
    const plant = useAppSelector(state => state.plant)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchPlants("banana"))
    }, [])

    console.log(plant.plants);
    console.log(plant.currentPlant);
    return (
        <>
            <Button onClick={() => dispatch(setCurrentPlant(plant.plants[0]))}>Click me!</Button>
            {plant.loading && <div>Loading...</div>}
            {!plant.loading && plant.error ? <div>Error: {plant.error}</div> : null}
            {!plant.loading && plant.plants.length ? (
                <>
                    <ul>
                        {plant.plants.map(plant => (
                            <li key={plant.id}>{plant.common_name}</li>
                        ))}
                    </ul>
                    {plant.currentPlant && plant.currentPlant.common_name ?
                        <div>Current plant: {plant.currentPlant.common_name}</div> : null}

                </>
            ) : null}
            <div>HomeScreenView2</div>

        </>

    )
}