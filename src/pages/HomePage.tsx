import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import {formatDate} from "../utils";
import {buttonStyle} from "../styles";

type User = {
  id?: string;
  email?: string;
  verified_email?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  hd?: string;
};

function HomePage({ token, removeToken }: { token: { accessToken: string, expiresOn: number }, removeToken: () => void }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  const logout = () => {
    setUser(undefined);
    removeToken();
    googleLogout();
  };

  const isTokenExpired = !token || !token.expiresOn || token.expiresOn <= Date.now()

  useEffect(() => {
    if (isTokenExpired) {
      logout();
    } else {
      const timer = setTimeout(() => {
        if (isTokenExpired) {
          logout();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTokenExpired, logout]);

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

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const data = {
    'Name': user?.name,
    'Email': user?.email,
    'Token expires at': formatDate(new Date(token.expiresOn)),
    'Current time': formatDate(currentTime)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <Button
        onClick={logout}
        variant="contained"
        sx={buttonStyle}
      >
        <span>Sign out</span>
      </Button>
      <table>
        <tbody>
        {Object.entries(data).map(([key, value]) =>
          <tr>
            <td style={{textAlign: 'right'}}>{key}:</td>
            <td style={{textAlign: 'left', paddingLeft: '1rem'}}>{value}</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}

export default HomePage;