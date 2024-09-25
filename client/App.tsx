import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomeScreen from "./Controllers/HomeScreenController";
import TopBar from "./components/TopBar";
import Button from '@mui/material/Button';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Button>Hello plantpal!</Button>}/>
                <Route path="/home" element={<HomeScreen/>}/>
            </Routes>
        </Router>
    );
};

export default App;