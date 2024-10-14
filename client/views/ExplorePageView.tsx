import React from 'react'
import {useNavigate} from 'react-router-dom'
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
    styled,
    alpha,
    InputBase, Grid, TextField, CircularProgress, Button
} from "@mui/material"
import {NavigateBefore, NavigateNext} from "@mui/icons-material"
import SearchBar from "../presenters/SearchBarController";

type Props = {
    slideDirection: "right" | "left" | undefined
    cards: any
    currentCards: number
    handleNext: () => void
    handlePrev: () => void
    searchResult: any
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

            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center"
            }}>
                <IconButton onClick={handlePrev} sx={{margin: 3}} color="secondary">
                    <NavigateBefore fontSize='large'/>
                </IconButton>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    overflow: 'hidden'
                }}>


                    {/* Search bar */}
                    <TextField
                        label="Search for a plant"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ marginBottom: '16px', maxWidth: '600px' }}
                    />

                    {loading && <CircularProgress sx={{ marginBottom: '16px', color: 'secondary.dark' }} />}

                    {searchResult.length > 0 ? (
                        <Box sx={{ marginBottom: '16px', width: '100%', maxWidth: '600px' }}>
                            {searchResult.map((plant: any) => (
                                <Box
                                    key={plant.id}
                                    sx={{
                                        marginBottom: '16px',
                                        marginTop: '16px',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        backgroundColor: 'info.main',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="h5">
                                        {plant.common_name || plant.scientific_name}
                                    </Typography>
                                    {plant.default_image?.original_url && (
                                        <img
                                            src={plant.default_image.original_url}
                                            alt={plant.common_name || plant.scientific_name}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                marginBottom: '8px',
                                                marginTop: '8px',
                                                border: '2px solid #B41878',
                                            }}
                                        />
                                    )}
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSelectPlant(plant)}
                                        sx={{
                                            backgroundColor: 'secondary.light',
                                            color: 'secondary.dark',
                                            margin: '8px',
                                            '&:hover': {
                                                backgroundColor: 'secondary.dark',
                                                color: 'secondary.light',
                                            },
                                        }}
                                    >
                                        Use this plant
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        searchResult.length === 0 &&
                        !selectedPlant &&
                        searchQuery &&
                        !loading && (
                            <Box sx={{ marginBottom: '16px' }}>
                                <Typography variant="body1">
                                    Sorry, we don't recognize that plant...please add it manually!
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleSelectPlant({})}
                                    sx={{
                                        backgroundColor: 'secondary.light',
                                        color: 'secondary.dark',
                                        margin: '8px',
                                        '&:hover': {
                                            backgroundColor: 'secondary.dark',
                                            color: 'secondary.light',
                                        },
                                    }}
                                >
                                    Add plant manually
                                </Button>
                            </Box>
                        )
                    </Grid>
                    <Stack direction="row" spacing={2}>
                        {cards.map((card: any) => (
                            <Slide key={`card-${card.index}`} direction={slideDirection}
                                   in={(card.index >= currentCards * 4 && card.index <= currentCards * 4 + 4 - 1)}
                                   appear={false}>
                                <Box sx={{
                                    textAlign: "center",
                                    display: (card.index >= currentCards * 4 && card.index <= currentCards * 4 + 4 - 1) ? "block" : "none",
                                    overflow: 'hidden'
                                }}>
                                    <Card variant="outlined" sx={{borderColor: '#B41878', borderRadius: 0}}>
                                        <CardActionArea>
                                            <CardMedia component="img"
                                                       image={card.image}
                                                       alt="green iguana"/>
                                        </CardActionArea>
                                    </Card>

                                    <Link sx={{color: 'secondary.main', cursor: "pointer"}} variant='body1'
                                          underline='hover'>
                                        {card.name}
                                    </Link>
                                </Box>
                            </Slide>
                        ))}
                    </Stack>
                </Box>
                <IconButton onClick={handleNext} sx={{margin: 3}} color="secondary">
                    <NavigateNext fontSize='large'/>
                </IconButton>
            </Box>

            <div></div>
        </Stack>
    )
}