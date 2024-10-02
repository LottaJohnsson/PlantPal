import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomeScreen from "./Controllers/HomeScreenController";
import GeneralScreen from "./Controllers/GeneralScreenController";
import AboutScreen from "./Controllers/AboutScreenController";
import TopBar from "./components/TopBar";
import Button from '@mui/material/Button';
import AuthScreenController from "./Controllers/AuthScreenController";
import {ThemeProvider} from "@mui/material/styles";
import customTheme from "./theme";
import PrivateRoute from "./components/PrivateRouter";
import ProfileScreen from "./Controllers/ProfileScreenController";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={customTheme}>
            <TopBar></TopBar>
            <Router>
                <Routes>
                    {/*Public Routes*/}
                    <Route path="/" element={<Button>Hello plantpals!</Button>}/>
                    <Route path="/home" element={<HomeScreen/>}/>
                    <Route path="/generalinfo" element={<GeneralScreen/>}/>
                    <Route path="/login" element={<AuthScreenController/>}></Route>
                    <Route path="/about" element={<AboutScreen/>}/>
                    <Route path="/profile" element={<ProfileScreen/>}/>
                    {/*Private Routes*/}
                    <Route path="/private" element={<PrivateRoute/>}>
                        <Route path="test" element={<Button>Private</Button>}/>
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;