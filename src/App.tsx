import React, {useState, useEffect} from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {Route, BrowserRouter as Router, Routes, Navigate} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import './App.css';
import {TToken, TUser} from "./types";

function App() {
  const [user, setUser] = useState<TUser | null>(null);

  const [token, setStoredToken] = useState<TToken | null>(() => {
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

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => onSuccess(codeResponse),
    onError: (error) => console.log('Login Failed: ', error)
  });

  const onSuccess = async (codeResponse: any) => {
    const expiresOn = (codeResponse.expires_in * 1000) + Date.now();
    Cookies.set('token', codeResponse.access_token, {expires: new Date(expiresOn), secure: true});
    setToken({expiresOn, accessToken: codeResponse.access_token});
    console.log("Successfully logged in!");
  }

  const logout = () => {
    setUser(null);
    removeToken();
    googleLogout();
  };

  const isTokenExpired = !token || !token.expiresOn || token.expiresOn <= Date.now()

  useEffect(() => {
    if (!user && isTokenExpired) {
      logout();
    } else {
      const timer = setTimeout(() => {
        if (isTokenExpired) {
          logout();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTokenExpired, logout, user]);

  useEffect(() => {
    if (token?.accessToken)
      fetchUserProfile(token.accessToken)
        .then(data => setUser(data));
  }, [token])

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      return await res.data
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login"/>}/>
          <Route
            path="/login"
            element={token
              ? <Navigate replace to="/home"/>
              : <LoginPage login={login}/>
            }
          />
          <Route element={<ProtectedRoute token={token?.accessToken}/>}>
            <Route
              path="/home"
              element={
                <HomePage token={token} user={user} logout={logout}/>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
