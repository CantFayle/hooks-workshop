import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import {formatDate} from "../utils";
import {buttonStyle} from "../styles";

function HomePage({ token, user, logout }: { token: { accessToken: string, expiresOn: number }, user: any, logout: () => void}) {
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