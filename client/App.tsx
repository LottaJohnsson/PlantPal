import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomeScreen from "./Controllers/HomeScreenController";
import TopBar from "./components/TopBar";
import Button from '@mui/material/Button';
import AuthScreenController from "./Controllers/AuthScreenController";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Button>Hello plantpals!</Button>} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login" element={<AuthScreenController/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;