import React, {useState, useEffect, useRef} from 'react'
import ExplorePageView from '../views/ExplorePageView'
import {Card} from '@mui/material'
import {fetchPlants} from "../redux/slices/plantSlice";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import { useNavigate } from 'react-router-dom';
import {setCurrentPlant} from '../redux/slices/plantSlice'
import {fetchCareAdvice} from "../redux/slices/careAdviceSlice";
import {Plant} from '../redux/slices/plantSlice';

type Props = {}
type Card = {
    image: string,
    name: string,
    index: number,
}
export default function ExplorePagePresenter({}: Props) {
    const [slideDirrection, setSlideDirection] = useState<"right" | "left" | undefined>("left")
    const [cards, setCards] = useState<Card[]>([])
    const [currentCards, setCurrentCards] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [initialPlants, setInitialPlants] = useState<Card[]>([]);
    const initialPlantsSet = useRef(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch()


    const plants = useAppSelector(state => state.plant)

    useEffect(() => {
        dispatch(fetchPlants(""))
    }, [dispatch])
    
    useEffect(() => {
        console.log("Plants state updated:", plants);
        
        if (plants.plants) {
            const newCards = plants.plants.map((plant: any, i: number) => ({
                image: plant.default_image?.medium_url || 'https://i.ebayimg.com/images/g/pQoAAOSwAa1f2dlL/s-l960.webp',
                name: plant.common_name,
                index: i,
                id: plant.id,
                plant: plant
            }));
            setCards(newCards);
            if (!initialPlantsSet.current) {
                console.log("Setting initial plants:", newCards);
                setInitialPlants(newCards);
                initialPlantsSet.current = true;
            }
        }
    }, [plants]);

    const skeletonCards: Card[] = Array.from({ length: 28 }, (_, i) => ({
        image: '',
        name: '',
        index: i,
    }));

    const pages = 7;

    function handleOptionClickCB(plant: Plant) {
        dispatch(setCurrentPlant(plant))
        dispatch(fetchCareAdvice(plant.id))
        navigate(`/generalinfo`,);
    }

    function handleSearchQueryChangeCB(query: string) {
        setSearchQuery(query)
        setLoading(true)
        dispatch(fetchPlants(searchQuery))
    }


    function handleNext() {
        setSlideDirection("left")
        setCurrentCards((prevCards) => (prevCards + 1) % (pages))
    }

    function handlePrev() {
        setSlideDirection("right")
        setCurrentCards((prevCards) => ((prevCards - 1) % (pages) + pages) % pages)
    }


    return (
        <ExplorePageView 
            slideDirection={slideDirrection} 
            cards={cards.length > 0 ? cards : skeletonCards} 
            currentCards={currentCards}
            handleNext={handleNext} handlePrev={handlePrev}
            onSearchQueryChange={handleSearchQueryChangeCB}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            onOptionClick={handleOptionClickCB}
            initialPlants={initialPlants}
            />
    )
}