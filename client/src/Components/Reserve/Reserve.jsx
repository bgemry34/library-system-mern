import React, { useState, useEffect } from 'react'
import styles from './Reserve.module.css'
import { fetchBooks } from '../../Api/Books/Books'
import AddIcon from '@material-ui/icons/Add'
import {
  Container,
  Grid,
  Backdrop,
  CircularProgress,
  TextField,
  TableContainer,
  Paper,
  Table,
  Button,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@material-ui/core'
//import Autocomplete from '@material-ui/lab/Autocomplete'
import ClearIcon from '@material-ui/icons/Clear'
import { formatDate } from '../../Tools/Tools'
import SendIcon from '@material-ui/icons/Send'
import { reserveBook } from '../../Api/Reservation/Reservation'
import cx from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

function Reserve() {
  const classes = useStyles()

  const [books, setBooks] = useState([])
  const [reservedBooksContainer, setReservedBooksContainer] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [successReserved, setSuccessReserved] = useState(0)
  const [failedReserved, setFailedReserved] = useState(0)
  const [reservationDate, setReservationDate] = useState(
    formatDate(new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000))
  )
  const [failedReservedErrorContainer, setFailedReservedErrorContainer] =
    useState([])

  useEffect(() => {
    let isCancelled = false

    const fetchApi = async () => {
      let booksData = await fetchBooks()
      if (!isCancelled) {
        setBooks(booksData)
      }
    }
    try {
      fetchApi()
    } catch (e) {
      console.log(e)
    }

    return () => (isCancelled = true)
  }, [])

  const refreshBook = async () => {
    let isCancelled = false

    const fetchApi = async () => {
      let booksData = await fetchBooks()
      if (!isCancelled) {
        setBooks(booksData)
      }
    }
    try {
      fetchApi()
    } catch (e) {
      console.log(e)
    }

    return () => (isCancelled = true)
  }

  const getStatusStyle = (status) => {
    if (status.toLowerCase() === 'available')
      return {
        color: '#2ecc71',
        fontWeight: 'bold',
        textTransform: 'capitalize',
      }
    else if (status.toLowerCase() === 'borrowed')
      return {
        color: '#e74c3c',
        fontWeight: 'bold',
        textTransform: 'capitalize',
      }
    else if (status.toLowerCase() === 'reserved')
      return {
        color: '#f1c40f',
        fontWeight: 'bold',
        textTransform: 'capitalize',
      }
  }

  const addBorrowBook = (book) => {
    setReservedBooksContainer([book, ...reservedBooksContainer])
    setBooks(books.filter((_book) => _book.id !== book.id))
  }

  const revertBook = (book) => {
    setBooks([book, ...books])
    setReservedBooksContainer(
      reservedBooksContainer.filter((_book) => _book.id !== book.id)
    )
  }

  const clearBorrowBooks = () => {
    setBooks([...reservedBooksContainer, ...books])
    setReservedBooksContainer([])
  }

  //sequenction fetching borring request using reduce
  const _ReserveBook = async () => {
    setLoadingProgress(0)
    setLoading(true)
    let count = 0
    await reservedBooksContainer.reduce(async (memo, book) => {
      await memo
      const res = await reserveBook(reservationDate, book.id)
      if (!res) return 0
      else if (res.status === 200 || res.status === 201) {
        count++
        setLoadingProgress((count / reservedBooksContainer.length) * 100)
        setSuccessReserved((s) => (s += 1))
      } else if (res.status === 400) {
        setFailedReserved((f) => (f += 1))
        setFailedReservedErrorContainer((failBook) => {
          return [...failBook, res.data.error]
        })
      }
    }, undefined)
    setLoadingProgress(100)
    clearBorrowBooks()
    refreshBook()
    setReservationDate(
      formatDate(new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000))
    )
  }

  const errorDispenser = () => {
    if (failedReservedErrorContainer.length > 0) {
      return (
        <div>
          <Typography style={{ textAlign: 'left', marginTop: '10px' }}>
            Errors:
          </Typography>
          {failedReservedErrorContainer.map((err, index) => (
            <React.Fragment key={index}>
              <Typography style={{ textAlign: 'left', marginTop: '10px' }}>
                {err}
              </Typography>
            </React.Fragment>
          ))}
          1
        </div>
      )
    }
  }

  const overlayLoading = (
    <Backdrop
      style={{ backgroundColor: 'rgba(0,0,0,0.75) !important' }}
      className={classes.backdrop}
      open={loading}
    >
      <div style={{ width: '50%' }}>
        {loadingProgress !== 100 ? (
          <>
            <CircularProgress
              style={{ display: 'block', margin: 'auto' }}
              color="inherit"
            />
            <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
              {Math.ceil(loadingProgress)}%
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              style={{ textAlign: 'center', marginTop: '10px' }}
            >
              Reserved Book Done!
            </Typography>
            <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
              Successful Reserved Book : {successReserved}
            </Typography>
            <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
              Failed Reserved Book : {failedReserved}
            </Typography>
            {errorDispenser()}
            <Button
              onClick={() => {
                setLoading(false)
                setSuccessReserved(0)
                setFailedReserved(0)
                setFailedReservedErrorContainer([])
              }}
              variant="contained"
              color="primary"
              style={{
                display: 'block',
                margin: 'auto',
                marginTop: '10px',
                backgroundColor: '#27ae60',
              }}
            >
              Okay
            </Button>
          </>
        )}
      </div>
    </Backdrop>
  )

  return (
    <div>
      <Container className={styles.Container}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item xs={6}>
            <TextField id="standard-basic" fullWidth label="Search Book" />
            {/* book list container */}
            <div className={styles.bookContainer}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell style={getStatusStyle(book.status)}>
                          {book.status}
                        </TableCell>
                        <TableCell align="center">
                          {book.status.toLowerCase() === 'available' ? (
                            <AddIcon
                              style={{
                                color: '#27ae60',
                                marginLeft: '5px',
                                cursor: 'pointer',
                              }}
                              onClick={() => addBorrowBook(book)}
                            />
                          ) : (
                            null
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="date"
              label="Date of Reservation"
              type="date"
              defaultValue={formatDate(
                new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
              )}
              className={styles.mt2}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              InputProps={{
                inputProps: {
                  min: formatDate(
                    new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
                  ),
                },
              }}
              onChange={(e) => {
                setReservationDate(e.target.value)
              }}
            />
            <Typography className={styles.mt2} variant={'h6'}>
              Reserved Books:
            </Typography>
            {/* Borrow book section */}
            <div className={styles.borrowedBookContainer}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  {/* <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
                                        </TableHead> */}
                  <TableBody>
                    {reservedBooksContainer.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell align="center">
                          {book.status.toLowerCase() === 'available' ? (
                            <ClearIcon
                              style={{
                                color: '#e74c3c',
                                marginLeft: '5px',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                revertBook(book)
                              }}
                            />
                          ) : (
                            ''
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <Button
              variant="contained"
              color="primary"
              className={styles.mt2}
              startIcon={<ClearIcon />}
              fullWidth
              onClick={() => {
                clearBorrowBooks()
              }}
            >
              Clear Reserved Books
            </Button>
            <div className="mt-1"></div>
            <Button
              variant="contained"
              color="secondary"
              className={cx(styles.mt2, styles.bgSuccess)}
              style={{ padding: '10px' }}
              startIcon={<SendIcon />}
              disabled={(reservedBooksContainer.length && reservationDate) <= 0}
              fullWidth
              onClick={_ReserveBook}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
      {overlayLoading}
    </div>
  )
}

export default Reserve
