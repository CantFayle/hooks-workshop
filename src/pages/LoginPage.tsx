import React from 'react';
import Button from "@mui/material/Button";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
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

function LoginPage({token, setToken}: { token: any, setToken: (newToken: any) => void }) {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => onSuccess(codeResponse),
    onError: (error) => console.log('Login Failed: ', error)
  });

  const onSuccess = async (codeResponse: any) => {
    const expiresOn = (codeResponse.expires_in * 1000) + Date.now();
    Cookies.set('token', codeResponse.access_token, { expires: new Date(expiresOn), secure: true });
    setToken({ expiresOn, accessToken: codeResponse.access_token });
    console.log("Successfully logged in!");
  }

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