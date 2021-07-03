import {
  Container,
  CssBaseline,
  Divider,
  Grid,
  Paper,
  TableCell,
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import PeopleIcon from '@material-ui/icons/People'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import GetAppIcon from '@material-ui/icons/GetApp'

const Dashboard = () => {
  useEffect(() => {
    // const getCounts = async () =>{
    //     const ItemCount = await getInventoryCount();
    //     const DepCount = await getDepartmentCount();
    //     const UsersCount = await getUsersCount();
    //     const getItems = await fetchItems();
    //     const resUsers = await getUsers();
    //     setCounts({
    //         items:ItemCount.data,
    //         departments:DepCount.data,
    //         users:UsersCount.count
    //     });
    //     setItems(getItems.data.reverse()[0])
    //     setUsers(resUsers.data.users.reverse()[0]);
    // }
    // getCounts();
  }, [])

  const [counts, setCounts] = useState({
    items: '---',
    departments: '---',
    users: '---',
  })

  const [items, setItems] = useState({})
  const [users, setUsers] = useState({})

  return (
    <div>
      <CssBaseline />
      <Container>
        {/* cards */}
        <Grid
          container
          spacing={1}
          direction="row"
          justify="center"
          alignItems="stretch"
          className={styles.cardsContainer}
        >
          <Grid item xs={12}>
            <Grid
              container
              spacing={3}
              justify="space-evenly"
              alignItems="stretch"
            >
              <Grid item md={4}>
                <Paper className={styles.Items}>
                  <div className={styles.ItemsSideColor}></div>
                  <div className={styles.Icons}>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      style={{ height: '100%' }}
                    >
                      <Grid item xs={12}>
                        <LibraryBooksIcon className={styles.iconStyle} />
                      </Grid>
                    </Grid>
                  </div>
                  <div className={styles.Content}>
                    <Typography variant={'h5'} className={styles.ContentTitle}>
                      Books
                    </Typography>
                    <Divider />
                    <Typography variant={'h5'} className={styles.ContentValue}>
                      {counts.items}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item md={4}>
                <Paper className={styles.Items}>
                  <div className={styles.DepartmentsSideColor}></div>
                  <div className={styles.Icons}>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      style={{ height: '100%' }}
                    >
                      <Grid item xs={12}>
                        <GetAppIcon className={styles.iconStyle} />
                      </Grid>
                    </Grid>
                  </div>
                  <div className={styles.Content}>
                    <Typography variant={'h5'} className={styles.ContentTitle}>
                      Borrowed Book
                    </Typography>
                    <Divider />
                    <Typography variant={'h5'} className={styles.ContentValue}>
                      {counts.departments}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item md={4}>
                <Paper className={styles.Items}>
                  <div className={styles.UsersSideColor}></div>
                  <div className={styles.Icons}>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      style={{ height: '100%' }}
                    >
                      <Grid item xs={12}>
                        <PeopleIcon className={styles.iconStyle} />
                      </Grid>
                    </Grid>
                  </div>
                  <div className={styles.Content}>
                    <Typography variant={'h5'} className={styles.ContentTitle}>
                      Students
                    </Typography>
                    <Divider />
                    <Typography variant={'h5'} className={styles.ContentValue}>
                      {counts.users}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* 2 tables */}
        <Grid style={{ marginTop: '35px' }} container spacing={3}>
          <Grid item md={6}>
            <Typography
              style={{ opacity: 0.5, marginBottom: '10px' }}
              variant="h5"
            >
              Recent Added Books
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Model</TableCell>
                    <TableCell align="right">Qty.</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{items.name}</TableCell>
                    <TableCell align="right">{items.model}</TableCell>
                    <TableCell align="right">{items.qty}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={6}>
            <Typography
              style={{ opacity: 0.5, marginBottom: '10px' }}
              variant="h5"
            >
              Recent Added Student
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Created Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{users.email}</TableCell>
                    <TableCell>{users.create_date}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Dashboard
