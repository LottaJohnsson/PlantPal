import React from "react";
import {AppBar, Box, IconButton, Toolbar, Typography, Button, InputBase, Autocomplete, TextField} from "@mui/material";

interface TopBarProps {
    isLoggedIn: boolean,
    onInputChange: (query: string) => void,
    data: any,
    buttonClick: (page: any) => void;
    onOptionClick: (id: number) => void;
}

function TopBar(
    {
        isLoggedIn,
        onInputChange,
        data,
        buttonClick,
        onOptionClick,

    }: TopBarProps) {

    return (
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

                    <Autocomplete
                        sx={{borderColor: "secondary"}}
                        freeSolo
                        id="free-solo-2-demo"
                        disableClearable
                        options={data ?? []}
                        getOptionKey={(option: any) => option.id ?? null}
                        getOptionLabel={(option: any) => option.common_name ?? option}
                        fullWidth={true}
                        onChange={(event, value: any) => onOptionClick(value.id)}
                        onInputChange={(e, input: string) => {
                            onInputChange(input)
                        }}
                        renderInput={(params) => (
                            <TextField

                                sx={{outlineColor: "secondary", width: 300, borderRadius: "100%"}}
                                {...params}
                                label="Search input"
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        type: 'search',
                                    },
                                }}
                            />
                        )}
                    />
                    <Box sx={{flexGrow: 1}}>
                        {isLoggedIn ? (<Button
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
                    </Box>

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default TopBar;