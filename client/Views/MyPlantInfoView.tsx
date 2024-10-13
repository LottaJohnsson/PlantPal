import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography } from '@mui/material'
import React, { SyntheticEvent } from 'react'
import PlantTable from "../components/PlantTable";
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    advice: any,
    species: any,
    handleTabChange: (event: SyntheticEvent<Element, Event>, tabindex: number) => void,
    onRemoveFromProfile: () => void,
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

export default function MyPlantInfoView({
    species,
    advice,
    handleTabChange,
    tabIndex,
    onRemoveFromProfile,
}: Props) {
    if (species && advice) {
        return (
            
            <Stack direction="column" sx={{padding: "3%"}} spacing={2} >
                <Stack direction="row" alignItems={"left"} spacing={2}>
                    <img src={species[0].default_image.original_url} alt={"plant image"} style={{
                        height: '300px',
                        objectFit: 'contain',
                        flex: 1,
                        objectPosition: 'left bottom',
                    }}/>
                    <Stack direction="column" flex={4} spacing={2}>
                        <Typography color="secondary" variant="h2">
                            {species[0].common_name}
                        </Typography>
                        <Button variant="contained" color='primary' onClick={() => onRemoveFromProfile()} endIcon={<DeleteIcon/>} fullWidth={false} >
                            Remove plant
                        </Button>
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
                    <CareAdviceTabs section={advice[0].section} handleTabChange={handleTabChange} tabIndex={tabIndex}>
                    </CareAdviceTabs>
                <PlantTable  plant={species[0]}/>
                </Stack>
            </Stack>

        )
    } else {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed', // Fix to the viewport
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent background
                    zIndex: 9999, // Ensure it is on top of other content
                }}
            >
                <CircularProgress size={80}/>
            </Box>
        )
    }
}