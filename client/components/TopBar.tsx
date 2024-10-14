import React from "react";
import {AppBar, Box, Toolbar, Typography, Button, Autocomplete, TextField} from "@mui/material";
import {Plant} from '../redux/slices/plantSlice';

//import SearchBar from "../Controllers/SearchBarController";

interface TopBarProps {
    isAuthenticated: boolean,
    onInputChange: (query: string) => void,
    data: Plant[],
    buttonClick: (page: string) => void;
    onOptionClick: (plant: Plant) => void;
}

function TopBar(
    {
        isAuthenticated,
        onInputChange,
        data,
        buttonClick,
        onOptionClick,
    }: TopBarProps) {


    return (
        <Box sx={{
            flexGrow: 1,
        }}>
            <AppBar position="static">
                <Toolbar>
                    <img
                        src="logo.png"
                        alt="my image"
                        style={{height: '50px'}}
                    >
                    </img>

                    <Typography variant="h3" component="div" color="primary.dark" sx={{flexGrow: 1}}>
                        PlantPal
                    </Typography>

                    <Autocomplete
                        sx={{paddingLeft: "30px", paddingTop: "10px", paddingBottom: "10px"}}
                        freeSolo
                        id="free-solo-2-demo"
                        disableClearable
                        options={data ?? []}
                        getOptionKey={(option: string | Plant) => typeof option === 'string' ? option : option.id ?? null}
                        getOptionLabel={(option: string | Plant) => typeof option === 'string' ? option : option.common_name ?? option}
                        onChange={(event, plant: string | Plant | null) => plant && typeof plant !== 'string' ? onOptionClick(plant) : null}
                        onInputChange={(e, input: string) => {
                            onInputChange(input)
                        }}
                        renderInput={(params) => (
                            <TextField
                                sx={{
                                    width: "300px",
                                }}
                                {...params}
                                label="Search for a plant"
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        type: 'search',
                                    },
                                }}
                            />
                        )}
                    />
                    <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'flex-start', gap: 2}}>
                        {isAuthenticated && (<Button
                            color="secondary"
                            onClick={() => buttonClick("profile")}
                        >Profile</Button>)}
                        <Button color="secondary"
                                onClick={() => buttonClick("explore")}
                        >Explore
                        </Button>
                        <Button color="secondary"
                                onClick={() => buttonClick("about")}
                        >About</Button>
                        {isAuthenticated ?
                            (<Button
                                sx={{whiteSpace: 'nowrap'}}
                                color="secondary"
                                onClick={() => buttonClick("logout")}
                            >Log out
                            </Button>) :
                            <Button
                                sx={{whiteSpace: 'nowrap'}}
                                color="secondary"
                                onClick={() => buttonClick("login")}>
                                Log in
                            </Button>}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default TopBar;