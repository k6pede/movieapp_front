'use client'

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from '@/config/FirebaseConfig';
import styles from './styles.module.scss'

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function validateEmail(email: string) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [emailError, setEmailError] = useState(false)


    const handleInputEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value
        setEmail(event.target.value)
        setEmailError(!validateEmail(newEmail));
    }

    const handleInputPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(password)
        setPassword(event.target.value)
    }


    const handleRegister = () => {

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            console.log(user)
            alert(user)
        }).catch((e) => {
            alert(e)
            console.log(e)
        })
    }



return (
  <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Register
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
            // 真偽値を返す関数を渡してバリデーション
                error={emailError}
                helperText={emailError ? "有効なメールアドレスを入力してください" : ""}
                margin="normal"
                variant='outlined'
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleInputEmail}
            />
            <TextField
                error={false}
                margin="normal"
                variant='outlined'
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleInputPassword}
            />
            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            />
            <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                className={styles.button}
                onClick={handleRegister}
            >
            Register
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  </ThemeProvider>
)}