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
import {useForm} from '../../Custom-Hook/userForm'


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

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();

  const [values, handleChange] = useForm({email:'', password:'', usertype:''});
  const [alert, setAlert] = useState('');


  const login = async (e) =>{
    e.preventDefault();
    setAlert('');
    history.push('/dashboard');
    // try{
    //   const res = await loginUser(form);
    //   if(res.status===200){
    //     sessionStorage.setItem('userToken',JSON.stringify(res.data.idToken));
    //     history.push('/dashboard');
    //   }else{
    //     setAlert((
    //       <Alert severity="error">Incorrect Email or Password</Alert>
    //     ))
    //   }
    // }catch(e){
    //   console.log(e);
    // }
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
          onChange={handleChange}
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
            label="Email Address"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            autoComplete="email"
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