import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomeScreen from "./Controllers/HomeScreenController";
import GeneralScreen from "./Controllers/GeneralScreenController";
import AboutScreen from "./Controllers/AboutScreenController";
import ExplorePage from "./Controllers/ExplorePageController";
import TopBar from "./Controllers/TopBarController";
import MyPlantInfo from "./Controllers/MyPlantInfoController";
import Button from '@mui/material/Button';
import AuthScreenController from "./Controllers/AuthScreenController";
import {ThemeProvider} from "@mui/material/styles";
import customTheme from "./theme";
import PrivateRoute from "./components/PrivateRouter";
import {useAuth} from "./Contexts/authContext"; // Should be removed later
import UploadPlantScreen from "./Controllers/UploadPlantScreenController";
import ProfileScreen from "./Controllers/ProfileScreenController";

const App: React.FC = () => {
    const {logoutUser} = useAuth(); // Should be removed later. Used to test logout

    return (
        <ThemeProvider theme={customTheme}>
            <Router>
                <TopBar/>
                <Routes>
                    {/*Public Routes*/}
                    <Route path="/"/>
                    <Route path="/home" element={<HomeScreen/>}/>
                    <Route path="/explore" element={<ExplorePage/>}/>
                    <Route path="/myplant" element={<MyPlantInfo/>}/>
                    <Route path="/generalinfo" element={<GeneralScreen/>}/>
                    <Route path="/login" element={<AuthScreenController/>}/>
                    <Route path="/about" element={<AboutScreen/>}/>
                    {/*Private Routes*/}
                    <Route element={<PrivateRoute/>}>
                        <Route path="test" element={<Button onClick={() => logoutUser()}>Logout</Button>}/> {/* Test for private route*/}
                        <Route path="upload" element={<UploadPlantScreen/>}/>
                        <Route path="profile" element={<ProfileScreen/>}/>
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;