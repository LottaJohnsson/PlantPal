import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import GeneralScreen from "./presenters/DetailScreenPresenter";
import AboutScreen from "./presenters/AboutScreenPresenter";
import ExplorePage from "./presenters/ExplorePagePresenter";
import TopBar from "./presenters/TopBarPresenter";
import Button from '@mui/material/Button';
import LoginScreenPresenter from "./presenters/LoginScreenPresenter";
import {ThemeProvider} from "@mui/material/styles";
import customTheme from "./theme";
import PrivateRoute from "./components/PrivateRouter";
import UploadPlantScreen from "./presenters/UploadPlantScreenPresenter";
import ProfileScreen from "./presenters/ProfileScreenPresenter";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={customTheme}>
            <Router>
                <TopBar/>
                <Routes>
                    {/*Public Routes*/}
                    <Route path="/" element={<ExplorePage/>}/>
                    <Route path="/generalinfo" element={<GeneralScreen/>}/>
                    <Route path="/login" element={<LoginScreenPresenter/>}/>
                    <Route path="/about" element={<AboutScreen/>}/>

                    {/*Private Routes*/}
                    <Route element={<PrivateRoute/>}>
                        <Route path="upload" element={<UploadPlantScreen/>}/>
                        <Route path="profile" element={<ProfileScreen/>}/>
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;