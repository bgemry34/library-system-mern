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
import { fetchDashBoardData } from '../../Api/Dashboard/Dashboard'
import { formatDate } from '../../Tools/Tools'

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalBooks: '---',
    totalBorrowedBooks: '---',
    totalStudents: '---',
  })

  const [recentAddedBooks, setRecentAddedBooks] = useState([])
  const [recentAddedStudents, setRecentAddedStudents] = useState([])
  const [recentBorrows, setRecentBorrows] = useState([])
  const [recentReservations, setRecentReservations] = useState([])

  useEffect(() => {
    const fetchApi = async () => {
      const data = await fetchDashBoardData()
      setCounts(data.counts)
      setRecentAddedBooks(data.recentBooks)
      setRecentAddedStudents(data.recentStudents)
      setRecentBorrows(data.recentBorrows)
      setRecentReservations(data.recentReservations)
      console.log(data.recentBorrows)
    }
    fetchApi()
  }, [])

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
                      {counts.totalBooks}
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
                      Borrowed Books
                    </Typography>
                    <Divider />
                    <Typography variant={'h5'} className={styles.ContentValue}>
                      {counts.totalBorrowedBooks}
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
                      {counts.totalStudents}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* 2 tables */}
        <Grid
          style={{ marginTop: '35px' }}
          justify="center"
          alignItems="stretch"
          container
          spacing={3}
        >
          <Grid item md={6}>
            <Typography
              style={{ opacity: 0.5, marginBottom: '10px' }}
              variant="h5"
            >
              Recent Borrow Requests
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date Created</TableCell>
                    <TableCell>Borrower</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBorrows &&
                    recentBorrows.map((borrow) => {
                      return (
                        <TableRow key={borrow.id}>
                          <TableCell>
                            {formatDate(borrow.dateCreated)}
                          </TableCell>
                          <TableCell>{borrow.user.name}</TableCell>
                          <TableCell>{borrow.bookTitle}</TableCell>
                          <TableCell>{borrow.status}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={6}>
            <Typography
              style={{ opacity: 0.5, marginBottom: '10px' }}
              variant="h5"
            >
              Recent Reservation Requests
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date Created</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Date Needed</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentReservations &&
                    recentReservations.map((reserve) => {
                      return (
                        <TableRow key={reserve.id}>
                          <TableCell>
                            {formatDate(reserve.dateCreated)}
                          </TableCell>
                          <TableCell>{reserve.user.name}</TableCell>
                          <TableCell>{reserve.bookTitle}</TableCell>
                          <TableCell>
                            {formatDate(reserve.reservationDate)}
                          </TableCell>
                          <TableCell>{reserve.status}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {/* 2 tables */}
        <Grid
          style={{ marginTop: '35px' }}
          justify="center"
          alignItems="stretch"
          container
          spacing={3}
        >
          <Grid item md={6}>
            <Typography
              style={{ opacity: 0.5, marginBottom: '10px' }}
              variant="h5"
            >
              Recently Added Books
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date Added</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Genre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAddedBooks &&
                    recentAddedBooks.map((book) => {
                      return (
                        <TableRow key={book.id}>
                          <TableCell>{formatDate(book.dateCreated)}</TableCell>
                          <TableCell>{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>{book.genre}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={6}>
            <Typography
              style={{ opacity: 0.5, marginBottom: '10px' }}
              variant="h5"
            >
              Recently Added Students
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date Added</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAddedStudents &&
                    recentAddedStudents.map((student) => {
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            {formatDate(student.dateCreated)}
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.username}</TableCell>
                        </TableRow>
                      )
                    })}
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
