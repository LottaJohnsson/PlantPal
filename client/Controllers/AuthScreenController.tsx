import React from 'react'
import LoginScreenView from '../Views/LoginScreenView'
import RegisterScreenView from '../Views/RegisterScreenView'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/authContext'

type Props = {}

export default function AuthScreenController({}: Props) {
  const [isLogin, setIsLogin] = React.useState(true)
  const emailRef = React.useRef('')
  const passwordRef = React.useRef('')
  const confirmPasswordRef = React.useRef('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
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

  async function handleLoginSubmitCB() {
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
      navigate('/private/test')
    } catch (error) {
      setError('Wrong email or password')
      console.log(error)
    }
  }

  async function handleRegisterSubmitCB() {
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
      navigate('/private/test')
    } catch (error) {
      setError('Something went wrong while registring account')
      console.log(error)
    }
  }

  return (
    <>
        {isLogin? <LoginScreenView error={error} setIsLogin={setIsLogin} onEmailChange={setEmailCB} onPasswordChange={setPasswordCB} onSubmit={handleLoginSubmitCB}/> : 
                  <RegisterScreenView error={error} setIsLogin={setIsLogin} onEmailChange={setEmailCB} onPasswordChange={setPasswordCB} onConfirmPassswordChange={setConfirmPasswordCB} onSubmit={handleRegisterSubmitCB}/>}
    </>
  )
}