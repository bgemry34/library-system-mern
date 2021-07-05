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
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import Brightness5Icon from '@material-ui/icons/Brightness5'
import EventIcon from '@material-ui/icons/Event'
import { formatDate } from '../../Tools/Tools'

export const adminDashboard = ({
  counts,
  recentAddedBooks,
  recentAddedStudents,
  recentBorrows,
  recentReservations,
}) => (
  <div>
    <CssBaseline />
    <Container>
      {/* cards */}
      <Grid style={{ height: '100%', paddingBottom: '10%' }}>
        <Grid
          container
          spacing={0}
          direction="row"
          justify="flex-start"
          alignItems="stretch"
          className={styles.cardsContainer}
        >
          <Grid container spacing={3} justify="center" alignItems="stretch">
            {/* start row */}
            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.TodaySideColor}></div>
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
            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.BookSideColor}></div>
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
                <div className={styles.StudentSideColor}></div>
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
            {/* end row */}
          </Grid>
        </Grid>
        {/* 2nd row grid */}
        <Grid
          container
          spacing={0}
          direction="row"
          justify="flex-start"
          alignItems="stretch"
          className={styles.cardsContainer}
        >
          <Grid container spacing={3} justify="center" alignItems="stretch">
            {/* start row */}
            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.BorrowSideColor}></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <AssignmentReturnIcon className={styles.iconStyle} />
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
                <div className={styles.ReserveSideColor}></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <EventIcon className={styles.iconStyle} />
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
                <div className={styles.WaitingSideColor}></div>
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
                    For Approval
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {counts.totalPendingReservations}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            {/* end row */}
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
              Recently Borrowed Books
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Borrower</TableCell>
                    <TableCell>Date Approved</TableCell>
                    <TableCell>Return Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBorrows &&
                    recentBorrows.map((borrow) => {
                      return (
                        <TableRow key={borrow.id}>
                          <TableCell>{borrow.bookTitle}</TableCell>
                          <TableCell>{borrow.user.name}</TableCell>
                          <TableCell>
                            {formatDate(borrow.approvedDate)}
                          </TableCell>
                          <TableCell>{formatDate(borrow.returnDate)}</TableCell>
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
              Recent Book Reservations
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
      </Grid>
    </Container>
  </div>
)
