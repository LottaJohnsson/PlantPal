import React from 'react'
import TopBar from "../components/TopBar";
import {
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import {Paper} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import customTheme from "../theme";

type Props = {}


//Dummmy data
function createData(
    name: string,
    data: string,
) {
    return {name, data};
}

// Combine all data into a single string for each row
const rows = [
    createData('Watering', 'Often'),
    createData('Soil Type', 'bla vla'),
    createData('Temperature', '20-30 C'),
    createData('Placement', 'Direct sunlight'),
    createData('Soil pH', '7'),
];

function BasicTable() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="plant table">
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            {/* First column for the header */}
                            <TableCell component="th" scope="row"
                                       sx={{borderRight: '1px solid rgba(224, 224, 224, 1)'}}>
                                {row.name}
                            </TableCell>
                            {/* Second column for the data */}
                            <TableCell align="left">{row.data}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


export default function GeneralScreenView({}: Props) {
    return (
        <>
            <Stack
                direction="row"
                spacing={2}
                sx={{flex: 1, '& > :not(style)': {width: '100%'}}}
            >
                <Stack
                    direction="column"
                    alignItems={"left"}
                    justifyContent={"center"}
                    sx={{padding: "3%"}}
                >
                    <img src={"general_info.png"} alt={"plant image"} style={{
                        height: '150px',
                        objectFit: 'contain',
                        flex: 1,
                        objectPosition: 'left bottom',

                    }}/>

                </Stack>

                <Stack
                    direction="column"
                    alignItems={"left"}
                    justifyContent={"center"}
                    spacing={2}
                    sx={{paddingRight: "10%"}}

                >
                    <Typography color="secondary" variant="h2">
                        Hoya
                    </Typography>
                    <Typography variant="h6">
                        Hoyas, also called wax plants, are an Asian native plant with fragrant, low-maintenance tropical
                        flowers that grow in a ball-shaped cluster. These low-maintenance plants produce woody stems
                        with
                        waxy leaves, which remain evergreen.
                    </Typography>
                    <BasicTable>
                    </BasicTable>
                </Stack>
            </Stack>
        </>
    )
}