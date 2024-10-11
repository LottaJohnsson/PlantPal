/**
 * This file contains the AuthContext which is used to manage the authentication state of the user.
 * Used as a provider in the App component to provide authentication functionality to all components.
 * Can register, login and logout users.
 * Has the current user stored in the context.
 * 
 * Example use of login:
 * import { useAuth } from './Contexts/authContext';
 * const loginUser = useAuth();
 * const success = await loginUser('ex', 'ex');
 * 
 * Exmple of getting current user:
 * import { useAuth } from './Contexts/authContext';
 * const { currentUser } = useAuth();
 * currentUser.email
 */

import React, { createContext, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

interface User {
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  currentUser?: User | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await response.json();
      if (data.loggedIn) {
        setIsAuthenticated(true);
        setCurrentUser({ email: email });
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const registerUser = async (email: string, password: string) => {
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
  
      const data = await response.json();
  
      if (data.registered) {
        setIsAuthenticated(true);
        setCurrentUser({ email: email });
        return true;
      }
  
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const logoutUser = () => {
    try {
      fetch('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.log(error);
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};