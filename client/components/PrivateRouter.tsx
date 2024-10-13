import {Outlet, Navigate} from 'react-router-dom';
import {useAuth} from '../Contexts/authContext';
import React from 'react';
import {useAppSelector} from "../redux/hooks";

const PrivateRoute: React.FC = () => {
    const auth = useAppSelector(state => state.auth)  // Get auth status from context
    return auth.isAuthenticated ? <Outlet/> : <Navigate to="/login" replace/>;
};

export default PrivateRoute;