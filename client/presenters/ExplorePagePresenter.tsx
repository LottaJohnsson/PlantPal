import React, {useState, useEffect} from 'react'
import ExplorePageView from '../views/ExplorePageView'
import {Card} from '@mui/material'
import {fetchPlants} from "../redux/slices/plantSlice";
import {useAppDispatch, useAppSelector} from "../redux/hooks";

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
    const dispatch = useAppDispatch();
    const plants = useAppSelector(state => state.plant)
    const []

    useEffect(() => {
        dispatch(fetchPlants(""))
    }, [])

    useEffect(() => {
        setCards(plants.plants.map((plant: any, i: number) => ({
            image: plant.default_image?.medium_url || "https://i.ebayimg.com/images/g/pQoAAOSwAa1f2dlL/s-l960.webp",
            name: plant.common_name,
            index: i
        })));
    }, [plants]);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        //setIsPlantSelected(false);
        setFormVisible(false);
        if (query.length > 2) {
            setLoading(true);
            try {
                const response = await fetch(`plants/search?query=${encodeURIComponent(query)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const json = await response.json();
                setSearchResult(json.result.slice(0, 8));

            } catch (error) {
                console.error("Error during search:", error);
                setSearchResult([]);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResult([]);
            setLoading(false);
        }
    };


    const pages = 7;

    function handleNext() {
        setSlideDirection("left")
        setCurrentCards((prevCards) => (prevCards + 1) % (pages))
    }

    function handlePrev() {
        setSlideDirection("right")
        setCurrentCards((prevCards) => ((prevCards - 1) % (pages) + pages) % pages)
    }


    return (
        <ExplorePageView slideDirection={slideDirrection} cards={cards} currentCards={currentCards}
                         handleNext={handleNext} handlePrev={handlePrev}/>
    )
}