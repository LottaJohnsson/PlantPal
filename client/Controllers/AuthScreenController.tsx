import React, { useState, useRef } from 'react'
import LoginScreenView from '../Views/LoginScreenView'
import RegisterScreenView from '../Views/RegisterScreenView'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/authContext'

type Props = {}

export default function AuthScreenController({}: Props) {
  const [isLogin, setIsLogin] = useState(true)
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const confirmPasswordRef = useRef('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { loginUser, registerUser } = useAuth()

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
    setIsLogin(isLogin)
    setError('')
  }

  function validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async function handleLoginSubmitCB() {
    if(emailRef.current === '' || passwordRef.current === ''){
      setError('Please fill in all fields')
      return;
    }
    if(!validateEmail(emailRef.current)){
      setError('Email is not in a valid format')
      return;
    }
    try {
      setError('')
      setLoading(true)
      const loggedIn = await loginUser(emailRef.current, passwordRef.current)
      if (!loggedIn) {
        setError('Wrong email or password')
        setLoading(false)
        return;
      }
      setLoading(false)
      navigate('/test') //Should be changed when profile page is added
    } catch (error) {
      setError('Wrong email or password')
      console.log(error)
    }
  }

  async function handleRegisterSubmitCB() {
    if(emailRef.current === '' || passwordRef.current === '' || confirmPasswordRef.current === ''){
      setError('Please fill in all fields')
      return;
    }
    if(!validateEmail(emailRef.current)){
      setError('Email is not in a valid format')
      return;
    }
    try {
      setError('')
      setLoading(true)
      const registered = await registerUser(emailRef.current, passwordRef.current)
      if(!registered){
        setError('Something went wrong while registring account')
        setLoading(false)
        return;
      }
      setLoading(false)
      navigate('/test') //Should be changed when profile page is added
    } catch (error) {
      setError('Something went wrong while registring account')
      console.log(error)
    }
  }

  return (
    <>
        {isLogin? <LoginScreenView error={error} loading={loading} setIsLogin={setIsLoginCB} onEmailChange={setEmailCB} onPasswordChange={setPasswordCB} onSubmit={handleLoginSubmitCB}/> : 
                  <RegisterScreenView error={error} loading={loading} setIsLogin={setIsLoginCB} onEmailChange={setEmailCB} onPasswordChange={setPasswordCB} onConfirmPassswordChange={setConfirmPasswordCB} onSubmit={handleRegisterSubmitCB}/>}
    </>
  )
}