import React from "react";
import {Box, Autocomplete, TextField} from "@mui/material";

interface SearchBarProps {
    onInputChange: (query: string) => void,
    data: any,
    onOptionClick: (id: string, name: string) => void;
}

function SearchBar(
    {
        onInputChange,
        data,
        onOptionClick,
    }: SearchBarProps
) {

    return (
        <Autocomplete
            sx={{paddingLeft: "30px", paddingTop: "10px", paddingBottom: "10px"}}
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={data ?? []}
            getOptionKey={(option: any) => option.id ?? null}
            getOptionLabel={(option: any) => option.common_name ?? option}
            fullWidth={true}
            onChange={(event, option: any) => onOptionClick(option.id, option.common_name)}
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
    );
}

export default SearchBar;