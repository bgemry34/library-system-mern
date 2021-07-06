import React, { useState, useEffect } from 'react'

import {
  // Paper,
  Grid,
  TextField,
  Container,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  DialogActions,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { fetchUsers, createUser } from './../../Api/Users/Users'
import { formatDate } from './../../Tools/Tools'
import { useForm } from './../../Custom-Hook/userForm'
import Alert from '@material-ui/lab/Alert'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [userForm, handleChange, setUserForm] = useForm({
    name: '',
    username: '',
    password: '',
    userType: '',
  })
  const [createModal, setCreateModal] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errorAlert, setErrorAlert] = useState('')
  const [alert, setAlert] = useState('')

  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      const res = await fetchUsers()
      if (!isCancelled) {
        setUsers(res)
      }
    }
    fetchApi()
    return () => (isCancelled = true)
  }, [])

  const registerUser = async (e) => {
    e.preventDefault()
    setProcessing(true)
    const res = await createUser(userForm)
    if (res.status === 200 || res.status === 201) {
      setCreateModal(false)
      setUsers([res.data, ...users])
      setAlert(<Alert severity="success">Successfully added new user.</Alert>)
      setTimeout(() => {
        setAlert('')
      }, 5000)
    } else {
      setErrorAlert(
        <Alert style={{ textTransform: 'capitalize' }} severity="error">
          {res.data.error}
        </Alert>
      )
      setTimeout(() => {
        setErrorAlert('')
      }, 10000)
    }

    setProcessing(false)
  }

  //Dialogs
  const addDialog = (
    <Dialog
      open={createModal}
      onClose={() => {
        setCreateModal(false)
        setUserForm({
          name: '',
          username: '',
          password: '',
          userType: 'student',
        })
      }}
      scroll="body"
      fullWidth
    >
      <form onSubmit={registerUser} method="post">
        <Container>
          <DialogTitle className="mt-2">Add User</DialogTitle>
        </Container>
        <DialogContent>
          <Container>
            {errorAlert}
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="name"
                onChange={handleChange}
                value={userForm.name}
                label="Name"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="username"
                onChange={handleChange}
                value={userForm.username}
                label="Username"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="password"
                onChange={handleChange}
                value={userForm.password}
                label="Password"
                type="password"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                id="standard-select-currency-native"
                select
                label="Select User Type:"
                name="userType"
                value={userForm.userType}
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </TextField>
            </FormControl>
          </Container>
        </DialogContent>
        <DialogActions>
          <Container>
            <Button
              id="addBtn"
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
              disabled={processing}
              style={{ marginBottom: '20px' }}
              size="large"
              type="submit"
              fullWidth
            >
              Add
            </Button>
          </Container>
        </DialogActions>
      </form>
    </Dialog>
  )

  return (
    <div>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <div>
              <TextField fullWidth id="standard-basic" label="Find User..." />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div>
              <Button
                variant="contained"
                color="primary"
                style={{
                  background: '#27ae60',
                  width: '30%',
                  float: 'right',
                  marginTop: '13px',
                }}
                endIcon={<AddIcon />}
                onClick={() => {
                  setCreateModal(true)
                }}
                fullWidth
              >
                Add User
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: '30px' }}>
          <Grid item xs={12}>
            {alert}
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Date Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.userType}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{formatDate(user.dateCreated)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {addDialog}
      </Container>
    </div>
  )
}

export default UserManagement
