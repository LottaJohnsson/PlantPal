import React from "react";

import {AppBar, Box, IconButton, Toolbar, Typography, Button, InputBase} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {ThemeProvider} from '@mui/material/styles';
import customTheme from "../theme";
import {Search} from "@mui/icons-material";
import {styled, alpha} from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';


const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        borderRadius: '1px',
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '40ch',
        },
    },
}));


function TopBar() {
    return (
        <ThemeProvider theme={customTheme}>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton>
                            <img
                                src="logo.png"
                                alt="my image"
                                style={{height: '50px'}}
                            >
                            </img>

                        </IconButton>

                        <Typography variant="h3" component="div" color="primary.dark" sx={{flexGrow: 1}}>
                            PlantPal
                        </Typography>

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon color="primary.dark"></SearchIcon>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{'aria-label': 'search'}}
                            />
                        </Search>
                        <Button color="secondary">Profile</Button>
                        <Button color="secondary">Explore</Button>
                        <Button color="secondary">About</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
    );
}

export default TopBar;