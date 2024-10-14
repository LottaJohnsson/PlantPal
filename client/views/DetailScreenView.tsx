import React, {SyntheticEvent} from 'react';
import {
    Box, CircularProgress, IconButton,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlantTable from "../components/PlantTable";

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

export default function GeneralScreenView(
    {
        species,
        advice,
        handleTabChange,
        tabIndex,
        onAddToProfile,
    }: GeneralScreenViewProps) {

    // Check loading and error states
    const isLoading = species.loading || advice.loading;
    const speciesError = species.error; // Adjust to your actual error structure
    const adviceError = advice.error; // Adjust to your actual error structure


    console.log(advice.careAdvice)
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 9999,
                }}
            >
                <CircularProgress size={80}/>
            </Box>
        );
    }

    if (speciesError || adviceError) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 9999,
                }}
            >
                <Typography variant="h4" color="error">
                    {speciesError?.message || adviceError?.message || "An error occurred"}
                </Typography>
            </Box>
        );
    }

    // Render the main content if not loading and no errors
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
                    <img src={species.currentPlant.default_image.original_url} alt={"plant image"} style={{
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
                        {species.currentPlant.common_name}
                    </Typography>

                    <CareAdviceTabs section={advice.careAdvice.section} handleTabChange={handleTabChange}
                                    tabIndex={tabIndex}>
                    </CareAdviceTabs>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onAddToProfile}
                        endIcon={<AddIcon/>}
                    >
                        Add to profile
                    </Button>
                    <PlantTable plant={species.currentPlant}/>
                </Stack>
            </Stack>
        </>
    );
}
