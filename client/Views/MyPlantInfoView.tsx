import { Box, Card, CardContent, CardHeader, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import React from 'react'

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

export default function MyPlantInfoView({}: Props) {
    return (
        
        <Stack direction="column" sx={{padding: "3%"}} spacing={2} >
            <Stack direction="row" alignItems={"left"} spacing={2}>
                <img src={"general_info.png"} alt={"plant image"} style={{
                    height: '300px',
                    objectFit: 'contain',
                    flex: 1,
                    objectPosition: 'left bottom',
                }}/>
                <Stack direction="column" flex={4} spacing={2}>
                    <Typography color="secondary" variant="h2">
                        Cactus
                    </Typography>
                    <Typography variant='h4'>
                        Tasks
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{alignItems: "baseline", alignContent: "baseline"}}>
                        <Card >
                            <CardHeader flex={1} title="Tomorrow 30/9" titleTypographyProps={{color: "info", variant: "body1"}} sx={{backgroundColor: "#B41878"}}/>
                            <CardContent sx={{height: "100%", backgroundColor: "#F1B6DA"}}>
                                <Typography variant='body1'>
                                    Water Cactus
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader flex={1} title="Today 29/9" titleTypographyProps={{color: "info", variant: "body1"}} sx={{backgroundColor: "#4DAC26"}}/>
                            <CardContent sx={{height: "100%", backgroundColor: "#B8E186"}}>
                                <Typography variant='body1'>
                                    Water Cactus
                                </Typography>
                            </CardContent>
                        </Card>
                        <Box sx={{height: "100%", justifyContent: "end"}}>
                        <Typography variant='body1'>
                            Show more...
                        </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={5}>
                <Typography variant='body1'>
                Hoyas, also called wax plants, are an Asian native plant with fragrant, low-maintenance tropical flowers
                 that grow in a ball-shaped cluster. These low-maintenance plants produce woody stems with waxy leaves, 
                 which remain evergreen.
                </Typography>
                <BasicTable>
                </BasicTable>
            </Stack>
        </Stack>

    )
}