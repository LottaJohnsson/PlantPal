import {Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import React from "react";
import { Plant } from "../redux/slices/plantSlice";

interface PlantTableProps {
    plant: Plant,
}

function createRow(
    name: string,
    data: string,
) {
    return {name, data};
}

export default function PlantTable({plant}: PlantTableProps) {
    const rows = [
        createRow('Cycle', plant.cycle),
        createRow('Other Names', plant.other_name.join(', ')),
        createRow('Scientific Name', plant.scientific_name[0]),
        createRow('Sunlight', plant.sunlight.join(', ')),
        createRow('Watering', plant.watering),
    ];

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="plant table">
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row"
                                       sx={{borderRight: '1px solid rgba(224, 224, 224, 1)'}}>
                                {row.name}
                            </TableCell>
                            <TableCell align="left">{row.data}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}