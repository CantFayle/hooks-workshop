import React, { useState } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@emotion/react';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import theme from "./theme";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [storedToken, setStoredToken] = useState(() => {
    try {
      const value = window.localStorage.getItem('token');
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem('token', JSON.stringify(null));
        return null;
      }
    } catch (err) {
      return null;
    }
  });

  const setToken = (newToken: any) => {
    try {
      window.localStorage.setItem('token', JSON.stringify(newToken));
    } catch (err) {
      console.log(err);
    }
    setStoredToken(newToken);
  };

  const removeToken = () => {
    try {
      window.localStorage.removeItem('token');
    } catch (err) {
      console.log(err);
    }
    setStoredToken(null);
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider
          clientId={process.env.REACT_APP_GOOGLE_O_AUTH_CLIENT_ID || ''}
        >
          <Router>
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route
                path="/login"
                element={storedToken
                  ? <Navigate replace to="/home" />
                  : <LoginPage token={storedToken} setToken={setToken} />
                }
              />
              <Route element={<ProtectedRoute token={storedToken} />}>
                <Route
                  path="/home"
                  element={
                    <HomePage token={storedToken} removeToken={removeToken} />
                  }
                />
              </Route>
            </Routes>
          </Router>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
