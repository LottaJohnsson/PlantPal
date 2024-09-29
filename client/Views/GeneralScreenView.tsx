import React, {SyntheticEvent} from 'react'
import {
    Box,
    Stack, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow, Tabs,
    Typography
} from "@mui/material";
import {Paper} from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';

interface GeneralScreenViewProps {
    advice: any,
    species: any,
    handleTabChange: (event: SyntheticEvent<Element, Event>, tabindex: number) => void,
    onAddToProfile: () => void,
    tabIndex: number
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

function createData(
    name: string,
    data: string,
) {
    return {name, data};
}


function CareAdviceTabs(props: any) {
    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs onChange={props.handleTabChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="lab API tabs example" value={props.tabIndex}>
                    {props.section.map((section: any, i: number) => (
                        <Tab label={section.type} key={section.type}
                             value={i}>
                        </Tab>
                    ))}
                </Tabs>
            </Box>
            {props.section.map((section: any, i: number) => (
                <CustomTabPanel key={section.type} value={props.tabIndex} index={i}>
                    <Typography>
                        {section.description}
                    </Typography>
                </CustomTabPanel>
            ))}
        </Box>
    )
}


function BasicTable(plant: any) {
    const rows = [
        createData('Cycle', plant.plant.cycle),
        createData('Other Names', plant.plant.other_name.join(', ')),
        createData('Scientific Name', plant.plant.scientific_name),
        createData('Sunlight', plant.plant.sunlight.join(', ')),
        createData('Watering', plant.plant.watering),
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


export default function GeneralScreenView(
    {
        species,
        advice,
        handleTabChange,
        tabIndex,
        onAddToProfile,
    }: GeneralScreenViewProps) {
    if (species && advice) {
        return (
            <>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{width: '100%', '& > :not(style)': {flex: 1}}}
                >
                    <Stack
                        direction="column"
                        alignItems={"left"}
                        justifyContent={"center"}
                        sx={{padding: "3%", flex: 1, minHeight: '300px'}}
                    >
                        <img src={species.default_image.original_url} alt={"plant image"} style={{
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
                        sx={{paddingRight: "10%", paddingTop: "5%", flex: 1}}
                    >
                        <Typography color="secondary" variant="h2">
                            {species.common_name}
                        </Typography>

                        <CareAdviceTabs section={advice.section} handleTabChange={handleTabChange}
                                        tabIndex={tabIndex}>
                        </CareAdviceTabs>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onAddToProfile()}
                            endIcon={<AddIcon/>}>
                            Add to profile
                        </Button>

                        <BasicTable plant={species}>
                        </BasicTable>
                    </Stack>


                </Stack>
            </>
        )

    } else {
        return (
            <div>Nothing found</div>
        )
    }

}