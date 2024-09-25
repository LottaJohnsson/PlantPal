import React from 'react'
import LoginScreenView from '../Views/LoginScreenView'
import RegisterScreenView from '../Views/RegisterScreenView'

type Props = {}

export default function AuthScreenController({}: Props) {
  const [isLogin, setIsLogin] = React.useState(true)
  return (
    <>
        {isLogin? <LoginScreenView setIsLogin={setIsLogin}/> : <RegisterScreenView setIsLogin={setIsLogin}/>}
    </>
  )
}