import React from 'react';
import Button from "@mui/material/Button";
import {buttonStyle} from "../styles";

const GoogleLogo = () =>
  <img
    src="https://img.icons8.com/color/48/000000/google-logo.png"
    alt="Google Logo"
    width={24}
    height={24}
    style={{
      marginRight: '8px',
      backgroundColor: 'white',
      borderRadius: '50%',
      padding: '3px'
    }}
  />

function LoginPage({ login }: { login: () => void }) {
  return (
    <div>
      <Button
        onClick={() => login()}
        variant="contained"
        sx={buttonStyle}
      >
        <GoogleLogo />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}

export default LoginPage;