import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    IconButton,
    Slide,
    Stack,
    Card,
    CardActionArea,
    Typography,
    CardMedia,
    Link,
    Skeleton,
    TextField,
    Collapse,
    Fade,
    Grid
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import SearchBar from "../presenters/SearchBarController";
import { TransitionGroup } from 'react-transition-group';

type Props = {
    slideDirection: "right" | "left" | undefined;
    cards: any;
    currentCards: number;
    handleNext: () => void;
    handlePrev: () => void;
    onSearchQueryChange: (query: string) => void;
    showSearch: boolean;
    setShowSearch: (showSearch: boolean) => void;
    onOptionClick: (plant: any) => void;
    initialPlants: any;
};

export default function ExplorePageView({ slideDirection, cards, currentCards, handleNext, handlePrev, onSearchQueryChange, showSearch, setShowSearch, onOptionClick, initialPlants }: Props) {
    const containerRef = React.useRef<HTMLElement>(null);

    function searchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
        const query = event.target.value;
        onSearchQueryChange(query);
        if (query.length > 0) {
            setShowSearch(true);
        } else {
            setShowSearch(false);
        }
    }

    function optionClick(plant: any) {
        onOptionClick(plant.plant);
    }

    return (
        <Stack spacing={2} sx={{ height: '90vh', padding: 0, margin: 0 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    textAlign: 'center',
                    minHeight: '30vh',
                }}
                ref={containerRef}
                >
                <TransitionGroup>
                     {
                     !showSearch && 
                     <Collapse>
                        <Typography variant='h2' sx={{ marginBottom: '16px' }}>
                        Looking for a plant?
                        </Typography>
                     </Collapse>
                    }
                    <div style={{ marginLeft: '2%', marginTop: '2%' }}>
                        <TextField
                            label="Search for a plant"
                            variant="outlined"
                            fullWidth
                            onChange={searchQueryChange}
                            sx={{ marginBottom: '16px', width: '600px' }}
                        />
                    </div>
                </TransitionGroup>
            </Box>
            {!showSearch &&
            <Fade in={!showSearch}>
                <Box sx={{ padding: '15px', backgroundColor: 'info.main' }}>
                    <div style={{ marginLeft: '2%', marginBottom: '4px' }}>
                        <Typography variant='h5' color='primary.dark'>
                            Need some inspiration? <br />
                            Take a look at some of our popular plants!
                        </Typography>
                    </div>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                    }}>
                        <IconButton onClick={handlePrev} sx={{ margin: 3 }} color="secondary">
                            <NavigateBefore fontSize='large' />
                        </IconButton>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "center",
                            overflow: 'hidden'
                        }}>
                            <Stack direction="row" spacing={2}>
                                {initialPlants.map((card: any) => (
                                    <Slide key={`card-${card.index}`} direction={slideDirection}
                                        in={(card.index >= currentCards * 5 && card.index <= currentCards * 5 + 5 - 1) ? true : false}
                                        appear={false}>
                                        <Box sx={{
                                            textAlign: "center",
                                            display: (card.index >= currentCards * 5 && card.index <= currentCards * 5 + 5 - 1) ? "block" : "none",
                                            overflow: 'hidden'
                                        }}>
                                            {initialPlants.length > 0 ? (
                                                <>
                                                    <CardActionArea onClick={() => optionClick(card)}>
                                                    <img
                                                    src={card.image}
                                                    alt={card.name}
                                                    style={{ width: '200px', height: '200px', border: '2px solid #B41878', objectFit: 'cover', objectPosition: 'center' }}
                                                    />
                                                    <Typography>{card.name}</Typography>
                                                    </CardActionArea>
                                                </>
                                            ) : (
                                                <Box sx={{ pt: 0.5 }}>
                                                    <Skeleton variant="rectangular" width={210} height={118} />
                                                    <Skeleton />
                                                    <Skeleton width="50%" />
                                                </Box>
                                            )}

                                        </Box>
                                    </Slide>
                                ))}
                            </Stack>
                        </Box>
                        <IconButton onClick={handleNext} sx={{ margin: 3 }} color="secondary">
                            <NavigateNext fontSize='large' />
                        </IconButton>
                    </Box>
                </Box>
            </Fade>
        }
            <Fade in={showSearch}>
                <Grid container spacing={2}>
                {cards.length > 0 ? (
                cards.map((card: any) => {
                    return (
                    <Grid item key={card.index} xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
                        {card.image ? (
                            <CardActionArea onClick={() => optionClick(card)}>
                            <img
                            src={card.image}
                            alt={card.name}
                            style={{ width: '200px', height: '200px', border: '2px solid #B41878', objectFit: 'cover', objectPosition: 'center' }}
                            />
                            <Typography>{card.name}</Typography>
                            </CardActionArea>
                        ) : (
                            <Box sx={{ pt: 0.5 }}>
                                <Skeleton variant="rectangular" width={210} height={118} />
                                <Skeleton />
                                <Skeleton width="50%" />
                            </Box>
                        )}
                        </Box>
                    </Grid>
                    );
                })
                ) : (
                <Typography sx={{ marginLeft: '16px' }}>
                    You don't have any plants yet. Click below to add one!
                </Typography>
                )}
            </Grid> 
            </Fade>
        </Stack>
    );
}