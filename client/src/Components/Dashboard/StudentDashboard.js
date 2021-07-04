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

import styles from './Dashboard.module.css'
import PeopleIcon from '@material-ui/icons/People'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import GetAppIcon from '@material-ui/icons/GetApp'
import Brightness5Icon from '@material-ui/icons/Brightness5'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { formatDate } from '../../Tools/Tools'

export const studentDashboard = ({ counts }) => (
  <div>
    <CssBaseline />
    <Container>
      <Grid
        container
        spacing={1}
        direction="row"
        justify="center"
        xs={12}
        
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
            <Grid item md={12}>
              <Paper className={styles.Items}>
                <div></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <Brightness5Icon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Date Today
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {new Date().toDateString().split(' ').join(' ')}
                  </Typography>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
                      <CalendarTodayIcon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Reserved Books
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {counts.totalReservedBooks}
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
                      <AccessTimeIcon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Reservations Waiting For Approval
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {counts.totalPendingReservations}
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
            Due For Return
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date Borrowed</TableCell>
                  <TableCell>Return Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {recentAddedBooks &&
                  recentAddedBooks.map((book) => {
                    return (
                      <TableRow key={book.id}>
                        <TableCell>{formatDate(book.dateCreated)}</TableCell>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.genre}</TableCell>
                      </TableRow>
                    )
                  })} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item md={6}>
          <Typography
            style={{ opacity: 0.5, marginBottom: '10px' }}
            variant="h5"
          >
            Pending Reservations
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Reservation Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {recentAddedStudents &&
                  recentAddedStudents.map((student) => {
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{formatDate(student.dateCreated)}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.username}</TableCell>
                      </TableRow>
                    )
                  })} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  </div>
)
