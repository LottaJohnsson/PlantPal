import React, {useState, useEffect} from 'react'
import ExplorePageView from '../Views/ExplorePageView'
import {Card} from '@mui/material'

type Props = {}

export default function ExplorePagePresenter({}: Props) {
    const [slideDirrection, setSlideDirection] = useState<"right" | "left" | undefined>("left")
    const [cards, setCards] = useState<React.ReactElement[]>([])
    const [currentCards, setCurrentCards] = useState(0)

    useEffect(() => {
        setCards(duplicateCards)
    }, [])


    const cardsPerPage = 4
    const duplicateCards: React.ReactElement[] = Array.from(
        {length: 12},
        (_, i) => <Card key={i}>
            Word of the Day {i}
        </Card>
    )
    const pages = duplicateCards.length / cardsPerPage

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