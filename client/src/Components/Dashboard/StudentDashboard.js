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
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import Brightness5Icon from '@material-ui/icons/Brightness5'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { formatDate } from '../../Tools/Tools'

export const studentDashboard = ({
  counts,
  forReturn,
  pendingReservations,
}) => (
  <div>
    <CssBaseline />
    <Container>
      <Grid
        container
        spacing={1}
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        className={styles.cardsContainer}
      >
        <Grid container spacing={3} justify="center" alignItems="stretch">
          <Grid item md={4}>
            <Paper className={styles.Items}>
              <div className={styles.DateSideColor}></div>
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
                  {new Date().toDateString()}
                </Typography>
              </div>
            </Paper>
          </Grid>
          {/* next */}
          <Grid item md={4}>
            <Paper className={styles.Items}>
              <div className={styles.WarningSideColor}></div>
              <div className={styles.Icons}>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  style={{ height: '100%' }}
                >
                  <Grid item xs={12}>
                    <ErrorOutlineIcon className={styles.iconStyle} />
                  </Grid>
                </Grid>
              </div>
              <div className={styles.Content}>
                <Typography variant={'h5'} className={styles.ContentTitle}>
                  For Return
                </Typography>
                <Divider />
                <Typography variant={'h5'} className={styles.ContentValue}>
                  {forReturn.length}
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
                  Waiting For Approval
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
      {/* next row */}
      <Grid
        container
        spacing={1}
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        className={styles.cardsContainer}
      >
        <Grid container spacing={3} justify="center" alignItems="stretch">
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
            For Return
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
                {forReturn &&
                  forReturn.map((book) => {
                    return (
                      <TableRow key={book.id}>
                        <TableCell>{book.bookTitle}</TableCell>
                        <TableCell>{formatDate(book.dateBorrowed)}</TableCell>
                        <TableCell>{formatDate(book.returnDate)}</TableCell>
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
            Waiting For Approval
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Reservation Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingReservations &&
                  pendingReservations.map((reservation) => {
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.bookTitle}</TableCell>
                        <TableCell>
                          {formatDate(reservation.dateCreated)}
                        </TableCell>
                        <TableCell>
                          {formatDate(reservation.reservationDate)}
                        </TableCell>
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
