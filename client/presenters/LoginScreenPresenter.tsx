import React, {useState, useRef, useEffect} from 'react';
import LoginScreenView from '../Views/LoginScreenView';
import RegisterScreenView from '../Views/RegisterScreenView';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {loginUserR, registerUserR} from "../redux/slices/authSlice";
import {fetchUserPlantsFromDB, generateTasks} from '../redux/slices/userSlice';

type Props = {}

export default function LoginScreenPresenter({}: Props) {
    const [isLogin, setIsLogin] = useState(true);
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const confirmPasswordRef = useRef('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);

    function setEmailCB(email: string) {
        emailRef.current = email;
    }

    function setPasswordCB(password: string) {
        passwordRef.current = password;
    }

    function setConfirmPasswordCB(confirmPassword: string) {
        confirmPasswordRef.current = confirmPassword;
    }

    function setIsLoginCB(isLogin: boolean) {
        setIsLogin(isLogin);
        setError('');
    }


    function validateEmail(email: string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    async function handleLoginSubmitCB() {
        if (emailRef.current === '' || passwordRef.current === '') {
            setError('Please fill in all fields');
            return;
        }
        if (!validateEmail(emailRef.current)) {
            setError('Email is not in a valid format');
            return;
        }
        setError('');
        setLoading(true);
        await dispatch(loginUserR({email: emailRef.current, password: passwordRef.current}));
    }

    async function handleRegisterSubmitCB() {
        if (emailRef.current === '' || passwordRef.current === '' || confirmPasswordRef.current === '') {
            setError('Please fill in all fields');
            return;
        }
        if (!validateEmail(emailRef.current)) {
            setError('Email is not in a valid format');
            return;
        }
        setError('');
        setLoading(true);
        await dispatch(registerUserR({email: emailRef.current, password: passwordRef.current}));
    }

    async function fetchUserData() {
        await dispatch(fetchUserPlantsFromDB());
        await dispatch(generateTasks());
    }

    useEffect(() => {
        if (auth.error) {
            setError(auth.error);
            setLoading(false);
        } else if (auth.isAuthenticated) {
            setLoading(false);
            navigate('/profile');
            fetchUserData();

        }
    }, [auth, navigate]);

    return (
        <>
            {isLogin ? (
                <LoginScreenView
                    error={error}
                    loading={loading}
                    setIsLogin={setIsLoginCB}
                    onEmailChange={setEmailCB}
                    onPasswordChange={setPasswordCB}
                    onSubmit={handleLoginSubmitCB}
                />
            ) : (
                <RegisterScreenView
                    error={error}
                    loading={loading}
                    setIsLogin={setIsLoginCB}
                    onEmailChange={setEmailCB}
                    onPasswordChange={setPasswordCB}
                    onConfirmPassswordChange={setConfirmPasswordCB}
                    onSubmit={handleRegisterSubmitCB}
                />
            )}
        </>
    );
}
