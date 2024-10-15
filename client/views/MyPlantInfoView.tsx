import { Alert, Box, Button, Card, CardContent, CardHeader, CircularProgress, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography } from '@mui/material'
import React, { SyntheticEvent } from 'react'
import PlantTable from "../components/PlantTable";
import DeleteIcon from '@mui/icons-material/Delete';
import { Task, UserPlant } from '../redux/slices/userSlice';
import TaskBox from '../components/TaskBox'
import { Plant } from '../redux/slices/plantSlice';
import { CareAdvice } from '../redux/slices/careAdviceSlice';

interface Props {
    paramExists: boolean,
    advice: any,
    species: any,
    plant: UserPlant | undefined,
    lateTasks: Task[],
    upcomingTasks: Task[],
    doneTasks: Task[],
    handleTabChange: (event: SyntheticEvent<Element, Event>, tabindex: number) => void,
    onRemoveFromProfile: () => void,
    tabIndex: number,
    onCompleteTask: (task: Task) => void;
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

interface tasksRowProps {
    plant: UserPlant | undefined,
    lateTasks: Task[],
    upcomingTasks: Task[],
    doneTasks: Task[],
    onCompleteTask: (task: Task) => void;
}

function TasksRow({
    plant,
    lateTasks,
    upcomingTasks,
    doneTasks,
    onCompleteTask,
}: tasksRowProps) {
    return (
        <Stack direction="row" spacing={2}>
            <Stack  direction="column" flex={4} spacing={2}>
                <Typography variant='h4'>
                    Late Tasks
                </Typography>
                <Stack direction="row" spacing={2} sx={{alignItems: "baseline", alignContent: "baseline"}}>
                    {lateTasks.filter((task) => task.taskName === `Water ${plant?.name}`).map((task, index) => (
                        <TaskBox key={index} task={task} onCompleteTask={onCompleteTask}/>
                    ))}
                </Stack>
            </Stack>
            <Stack  direction="column" flex={4} spacing={2}>
                <Typography variant='h4'>
                    UpcomingTasks
                </Typography>
                <Stack direction="row" spacing={2} sx={{alignItems: "baseline", alignContent: "baseline"}}>
                    {upcomingTasks.filter((task) => task.taskName === `Water ${plant?.name}`).map((task, index) => (
                        <TaskBox key={index} task={task} onCompleteTask={onCompleteTask}/>
                    ))}
                </Stack>
            </Stack>
            <Stack  direction="column" flex={4} spacing={2}>
                <Typography variant='h4'>
                    Completed Tasks
                </Typography>
                <Stack direction="row" spacing={2} sx={{alignItems: "baseline", alignContent: "baseline"}}>
                    {doneTasks.filter((task) => task.taskName === `Water ${plant?.name}`).map((task, index) => (
                        <TaskBox key={index} task={task} onCompleteTask={onCompleteTask}/>
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}

interface speciesInfoProps {
    plant: UserPlant | undefined,
    advice: any,
    species: any,
    handleTabChange: (event: SyntheticEvent<Element, Event>, tabindex: number) => void,
    tabIndex: number,
}

function SpeciesInfo({
    plant,
    advice,
    species,
    handleTabChange,
    tabIndex,
}: speciesInfoProps) {
    if (advice.loading || species.loading || parseInt(advice.careAdvice.species_id) !== parseInt(plant?.id? plant?.id : "0" )) {
     return(
        <div style={{ 
            display: 'flex',      
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            padding: "5%",
        }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent background
                }}
            >
                <CircularProgress size={80}/>
            </Box>
        </div>
     )   
    } else if (species.currentPlant && advice.careAdvice) {
        return (
            <Stack direction="row" spacing={5}>
                <CareAdviceTabs section={advice.careAdvice.section} handleTabChange={handleTabChange} tabIndex={tabIndex}>
                </CareAdviceTabs>
                <PlantTable  plant={species.currentPlant}/>
            </Stack>
        )
    } else {
        return (
            <Stack sx={{padding: "5%", flex: 2, alignContent: 'center'}}>
                <Alert severity="error" > Failed to get species information! </Alert>
            </Stack>
        )
    }
}

export default function MyPlantInfoView({
    paramExists,
    species,
    advice,
    plant,
    lateTasks,
    upcomingTasks,
    doneTasks,
    handleTabChange,
    tabIndex,
    onRemoveFromProfile,
    onCompleteTask,
}: Props) {
    if (!paramExists) {
        return (
            <div style={{ 
                display: 'flex',      
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent background
                    }}
                >
                    <Alert severity="error" > 404 Plant not found! </Alert>
                </Box>
            </div>
        )
    } else if (plant  && plant.id.length !== 0) {
        return (
            <Stack direction="column" sx={{padding: "3%"}} spacing={2} >
                <Stack direction="row" alignItems={"left"} spacing={2}>
                    <img src={plant?.imageFile && !plant?.imageURL ? plant?.imageFile : plant?.imageURL} alt={plant?.name} style={{
                        height: '300px',
                        maxWidth: '300px',
                        objectFit: 'cover',
                        flex: 1,
                        objectPosition: 'left bottom',
                    }}/>
                    <Stack direction="column" flex={4} spacing={2}>
                        <Typography color="secondary" variant="h2">
                            {plant?.name}
                        </Typography>
                        <Button variant="contained" color='warning' onClick={() => onRemoveFromProfile()} endIcon={<DeleteIcon/>} sx={{width: '200px'}} >
                            Remove plant
                        </Button>
                        <TasksRow plant={plant} lateTasks={lateTasks} upcomingTasks={upcomingTasks} doneTasks={doneTasks} onCompleteTask={onCompleteTask}></TasksRow>
                    </Stack>
                </Stack>
                <SpeciesInfo advice={advice} species={species} handleTabChange={handleTabChange} tabIndex={tabIndex} plant={plant}></SpeciesInfo>
            </Stack>
        )

    } else if (plant) {
        return (            
            <Stack direction="column" sx={{padding: "3%"}} spacing={2} >
                <Stack direction="row" alignItems={"left"} spacing={2}>
                    <img src={plant?.imageFile && !plant?.imageURL ? plant?.imageFile : plant?.imageURL} alt={plant?.name} style={{
                        height: '300px',
                        objectFit: 'contain',
                        flex: 1,
                        objectPosition: 'left bottom',
                    }}/>
                    <Stack direction="column" flex={4} spacing={2}>
                        <Typography color="secondary" variant="h2">
                            {plant?.name}
                        </Typography>
                        <Button variant="contained" color='warning' onClick={() => onRemoveFromProfile()} endIcon={<DeleteIcon/>} sx={{width: '200px'}} >
                            Remove plant
                        </Button>
                        <TasksRow plant={plant} lateTasks={lateTasks} upcomingTasks={upcomingTasks} doneTasks={doneTasks} onCompleteTask={onCompleteTask}></TasksRow>
                    </Stack>
                </Stack>
                <Stack sx={{padding: "5%", flex: 2, alignContent: 'center'}}>
                    <Typography align='center' variant='h6' >
                        To get plant species information add a plant from out api
                    </Typography>
                </Stack>
            </Stack>
        )
    } else {
        return (
            <div style={{ 
                display: 'flex',      
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent background
                    }}
                >
                    <CircularProgress size={80}/>
                </Box>
            </div>
        )
    }
}