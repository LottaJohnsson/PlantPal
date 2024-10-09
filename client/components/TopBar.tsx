import React from "react";
import {AppBar, Box, Toolbar, Typography, Button, Autocomplete, TextField} from "@mui/material";
import {useAuth} from '../Contexts/authContext'
import SearchBar from "../Controllers/SearchBarController";

interface TopBarProps {
    isAuthenticated: boolean,
    buttonClick: (page: any) => void;
}

function TopBar(
    {
        isAuthenticated,
        buttonClick,

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

                    <SearchBar/>

                    <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'flex-start', gap: 2}}>
                        {isAuthenticated ? (<Button
                            color="secondary"
                            onClick={() => buttonClick("profile")}
                        >Profile
                        </Button>) : (<Button
                            color="secondary"
                            onClick={() => buttonClick("profile")}
                        >Log in
                        </Button>)}
                        <Button color="secondary"
                                onClick={() => buttonClick("explore")}
                        >Explore
                        </Button>
                        <Button color="secondary"
                                onClick={() => buttonClick("about")}
                        >About</Button>
                        {isAuthenticated &&
                            (<Button
                                sx={{whiteSpace: 'nowrap'}}
                                color="secondary"
                                onClick={() => buttonClick("logout")}
                            >Log out
                            </Button>)}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default TopBar;