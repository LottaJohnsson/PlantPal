import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography } from '@mui/material'
import React, { SyntheticEvent } from 'react'
import PlantTable from "../components/PlantTable";
import DeleteIcon from '@mui/icons-material/Delete';
import { Task, UserPlant } from '../redux/slices/userSlice';
import TaskBox from '../components/TaskBox'

interface Props {
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

/* interface TabPanelProps {
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
} */

export default function MyPlantInfoView({
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
    if (species && advice) {
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
                        </Stack>
                    </Stack>
                </Stack>
                {/* <Stack direction="row" spacing={5}>
                    <CareAdviceTabs section={advice.section} handleTabChange={handleTabChange} tabIndex={tabIndex}>
                    </CareAdviceTabs>
                <PlantTable  plant={species}/>
                </Stack> */}
                <Typography variant='h4'>
                    Completed Tasks
                </Typography>
                <Stack direction="row" spacing={2} sx={{alignItems: "baseline", alignContent: "baseline"}}>
                    {doneTasks.filter((task) => task.taskName === `Water ${plant?.name}`).map((task, index) => (
                        <TaskBox key={index} task={task} onCompleteTask={onCompleteTask}/>
                    ))}
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