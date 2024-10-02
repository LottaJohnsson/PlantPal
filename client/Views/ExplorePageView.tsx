import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Box, IconButton, Slide, Stack, Card, CardActionArea, Typography, CardMedia, Link} from "@mui/material"
import {NavigateBefore, NavigateNext} from "@mui/icons-material"

type Props = {
    slideDirection: "right" | "left" | undefined
    cards: Array<React.ReactElement>
    currentCards: number
    handleNext: () => void
    handlePrev: () => void
}

export default function ExplorePageView({slideDirection, cards, currentCards, handleNext, handlePrev}: Props) {
    /* const [slideDirrection, setSlideDirection] = useState< "right" | "left" | undefined >("left")
    const [cards,setCards] = useState<React.ReactElement[]>([])
    const [currentCards, setCurrentCards] = useState(0)

    useEffect(() => {
        setCards(duplicateCards)
    }, [])

    const cardsPerPage = 4
    const duplicateCards: React.ReactElement[] = Array.from(
        { length: 12},
        (_, i) => <Card key={i}><CardActionArea>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                Word of the Day efhclehnlvcesklbklekwh{i}
                </Typography>
            </CardActionArea></Card>
    )
    const pages = duplicateCards.length/cardsPerPage

    const handleNext = () => {
        setSlideDirection("left")
        console.log('prev: %d', currentCards)
        setCurrentCards((prevCards) => (prevCards + 1)%(pages))
        console.log('prevAfter: %d', currentCards)
    }
    const handelPrev = () => {
        setSlideDirection("right")
        console.log('prev: %d', currentCards)
        setCurrentCards((prevCards) => ((prevCards - 1)%(pages)+pages)%pages)
        console.log('prevAfter: %d', currentCards)
    } */

    return (
    <Stack spacing={2} justifyContent="space-between" sx={{height: '90vh', padding: 0}}>
        <div>

            <Typography variant='h2'>
                Looking for a plant?    
            </Typography>
            <div>
                <input type='text' placeholder='Search plants...'></input>
            </div>
        </div>

        <div>
            <Typography variant='h5'>
                Need some inspiration? <br/>
                Take a look at some of our popular plants!
            </Typography>
        </div>

        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "center"}}>
            <IconButton onClick={handlePrev} sx={{margin: 3}} >
                <NavigateBefore fontSize='large'/>
                </IconButton>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "center", overflow: 'hidden'}}>
                <Stack direction="row" spacing={2}>
                    {cards.map((card,index) => (
                        <Slide  key={`card-${index}`} direction={slideDirection} in={(index >= currentCards*4  && index <= currentCards*4+4 - 1)} appear={false}>
                            <Box  sx={{textAlign: "center", display: (index >= currentCards*4 && index <= currentCards*4+4 - 1) ? "block" : "none", overflow: 'hidden'}}>
                                <CardActionArea>
                                <CardMedia component="img"
                                image="https://www.w3schools.com/images/w3schools_green.jpg"
                                alt="green iguana"/>
                                </CardActionArea>

                                <Link sx={{ color: 'text.secondary', cursor: "pointer"}} variant='body1' underline='hover'>
                                Plant {index}
                                </Link>
                            </Box>
                        </Slide>
                    ))}
                </Stack>
            </Box>
            <IconButton onClick={handleNext} sx={{margin: 3}} >
                <NavigateNext fontSize='large'/>
            </IconButton>
        </Box>

        <div></div>
    </Stack>
    )
}