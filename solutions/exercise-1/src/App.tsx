import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, token, login, logout } = useAuth();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route
            path="/login"
            element={token
              ? <Navigate replace to="/home" />
              : <LoginPage login={login} />
            }
          />
          <Route element={<ProtectedRoute token={token} />}>
            <Route
              path="/home"
              element={
                <HomePage token={token} user={user} logout={logout} />
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
