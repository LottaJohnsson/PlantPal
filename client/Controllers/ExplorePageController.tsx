import React, { useState, useEffect } from 'react'
import ExplorePageView from '../Views/ExplorePageView'
import { Card } from '@mui/material'
import { usePlant } from '../Contexts/plantContext';

type Props = {}

export default function ExplorePageController({}: Props) {
  const [slideDirrection, setSlideDirection] = useState< "right" | "left" | undefined >("left")
  const [cards,setCards] = useState<React.ReactElement[]>([])
  const [currentCards, setCurrentCards] = useState(0)
  const {search} = usePlant()

  useEffect(() => {
    setCards(duplicateCards)
  }, [])


  const cardsPerPage = 4
  const duplicateCards: React.ReactElement[] = Array.from(
    { length: 12},
    (_, i) => <Card key={i}>
            Word of the Day {i}
            </Card>
  )
  const pages = duplicateCards.length/cardsPerPage

  function handleNext() {
    setSlideDirection("left")
    console.log('prev: %d', currentCards)
    setCurrentCards((prevCards) => (prevCards + 1)%(pages))
    console.log('prevAfter: %d', currentCards)
  }

  function handlePrev() {
    setSlideDirection("right")
    console.log('prev: %d', currentCards)
    setCurrentCards((prevCards) => ((prevCards - 1)%(pages)+pages)%pages)
    console.log('prevAfter: %d', currentCards)
  }


    return (
        <ExplorePageView slideDirection={slideDirrection} cards={cards} currentCards={currentCards} handleNext={handleNext} handlePrev={handlePrev}/>
      )
}