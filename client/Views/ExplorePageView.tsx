import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Box, IconButton, Slide, Stack, Card, CardActionArea, Typography, CardMedia, Link, styled, alpha, InputBase} from "@mui/material"
import {NavigateBefore, NavigateNext} from "@mui/icons-material"
import SearchBar from "../Controllers/SearchBarController";

type Props = {
    slideDirection: "right" | "left" | undefined
    cards: Array<React.ReactElement>
    currentCards: number
    handleNext: () => void
    handlePrev: () => void
}

export default function ExplorePageView({slideDirection, cards, currentCards, handleNext, handlePrev}: Props) {
    
    return (
    <Stack spacing={2} justifyContent="space-between" sx={{height: '90vh', padding: 0, margin: 0}}>
        <div style={{marginLeft: '2%', marginTop: '2%'}}>

            <Typography variant='h2'>
                Looking for a plant?    
            </Typography>
            <div>
                <SearchBar/>
            </div>
        </div>

        <div style={{marginLeft: '2%'}}>
            <Typography variant='h5' color='primary.dark'>
                Need some inspiration? <br/>
                Take a look at some of our popular plants!
            </Typography>
        </div>

        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "center"}}>
            <IconButton onClick={handlePrev} sx={{margin: 3}} color="secondary">
                <NavigateBefore fontSize='large' />
            </IconButton>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "center", overflow: 'hidden'}}>
                <Stack direction="row" spacing={2}>
                    {cards.map((card,index) => (
                        <Slide  key={`card-${index}`} direction={slideDirection} in={(index >= currentCards*4  && index <= currentCards*4+4 - 1)} appear={false}>
                            <Box  sx={{textAlign: "center", display: (index >= currentCards*4 && index <= currentCards*4+4 - 1) ? "block" : "none", overflow: 'hidden'}}>
                                <Card variant="outlined" sx={{borderColor: '#B41878', borderRadius: 0}}>
                                <CardActionArea >
                                <CardMedia component="img"
                                image="https://www.w3schools.com/images/w3schools_green.jpg"
                                alt="green iguana"/>
                                </CardActionArea>
                                </Card>
                                
                                <Link sx={{ color: 'secondary.main', cursor: "pointer"}} variant='body1' underline='hover'>
                                Plant {index}
                                </Link>
                            </Box>
                        </Slide>
                    ))}
                </Stack>
            </Box>
            <IconButton onClick={handleNext} sx={{margin: 3}} color="secondary" >
                <NavigateNext fontSize='large'/>
            </IconButton>
        </Box>

        <div></div>
    </Stack>
    )
}