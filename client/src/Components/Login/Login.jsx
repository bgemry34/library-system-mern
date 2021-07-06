import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
// import {loginUser} from './../../Api/users';
// import { Alert } from '@material-ui/lab';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import {useForm} from './../../Custom-Hook/userForm';
import {loginUser} from './../../Api/Users/Users';
import Alert from '@material-ui/lab/Alert';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();

  const [values, handleChange] = useForm({username:'', password:'', usertype:''});
  const [alert, setAlert] = useState('');


  const login = async (e) =>{
    e.preventDefault();
    setAlert('');

    try{
      const res = await loginUser(values);
      if(res.status===200){
        const {token} = res.data;
        sessionStorage.setItem("userToken", token);
        history.push('/dashboard')
      }else{
        setAlert((
          <Alert style={{marginBottom:'20px'}} severity="error">Incorrect username, usertype or password. Pls Try Again</Alert>
        ));
        setTimeout(()=>{
          setAlert('');
        }, 10000)
      }
    }catch(e){
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        
        <form onSubmit={login} className={classes.form}>
          {alert}
     <FormControl variant="outlined" fullWidth={true}>
        <InputLabel id="demo-simple-select-outlined-label">Select User Type</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={values.usertype}
          name="usertype"
          onChange={handleChange}
          required
          label="Select User Type"
        >
          <MenuItem value="">
            <em>--Select User Type--</em>
          </MenuItem>
          <MenuItem value={'student'}>Student</MenuItem>
          <MenuItem value={'admin'}>Admin</MenuItem>
        </Select>
      </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            required
            autoComplete="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            value={values.password}
            onChange={handleChange}
            label="Password"
            type="password"
            id="password"
            required
            autoComplete="current-password"
          />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              className={classes.submit}
            >
              Sign In
            </Button>
        </form>
      </div>
      {/* <Box mt={8}>
        <Copyright />
      </Box> */}
    </Container>
  );
}