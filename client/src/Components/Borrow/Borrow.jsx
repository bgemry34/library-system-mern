import React, { useState, useEffect } from 'react'
import styles from './Borrow.module.css'
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
import { fetchUsers } from './../../Api/Users/Users'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ClearIcon from '@material-ui/icons/Clear'
import SendIcon from '@material-ui/icons/Send'
import { borrowBook } from './../../Api/Borrower/Borrower'
import cx from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import {debounce} from 'lodash';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

function Borrow() {
  const classes = useStyles()

  const [books, setBooks] = useState([])
  const [borrowedBooksContainer, setBorrowedBooksContainer] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    let isCancelled = false

    const fetchApi = async () => {
      let booksData = await fetchBooks()
      let usersData = await fetchUsers()
      if (!isCancelled) {
        setBooks(booksData)
        setUsers(usersData)
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
      let usersData = await fetchUsers()
      if (!isCancelled) {
        setBooks(booksData)
        setUsers(usersData)
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

  const searchChange = debounce( async (text) =>{
    
    let isCancelled = false

    let booksData = await fetchBooks(text);
    console.log(booksData, text)
    if(!isCancelled)
    setBooks(booksData);

    return () => (isCancelled = true)
  }, 1500)

  const addBorrowBook = (book) => {
    setBorrowedBooksContainer([book, ...borrowedBooksContainer])
    setBooks(books.filter((_book) => _book.id !== book.id))
  }

  const revertBook = (book) => {
    setBooks([book, ...books])
    setBorrowedBooksContainer(
      borrowedBooksContainer.filter((_book) => _book.id !== book.id)
    )
  }

  const clearBorrowBooks = () => {
    setBooks([...borrowedBooksContainer, ...books])
    setBorrowedBooksContainer([])
  }

  //sequenction fetching borring request using reduce
  const BorrowBook = async () => {
    setLoadingProgress(0)
    setLoading(true)
    let count = 0
    await borrowedBooksContainer.reduce(async (memo, book) => {
      await memo
      const res = await borrowBook(selectedUser.id, book.id)
      if (!res) return 0
      else if (res.status === 200 || res.status === 201) {
        count++
        setLoadingProgress((count / borrowedBooksContainer.length) * 100)
      }
    }, undefined)
    setLoadingProgress(100)
    clearBorrowBooks()
    refreshBook()
    setSelectedUser('')
  }

  const overlayLoading = (
    <Backdrop className={classes.backdrop} open={loading}>
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
            <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
              Successfully Borrow Book
            </Typography>
            <Button
              onClick={() => {
                setLoading(false)
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
            <TextField 
            id="standard-basic" 
            fullWidth 
            onChange={(e)=>searchChange(e.target.value)}
            label="Search Book" />
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
                            ''
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
            <Autocomplete
              id="user-select-combobox"
              className={styles.borrowersNameContainer}
              fullWidth
              options={users}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              getOptionSelected={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose borrower"
                  variant="outlined"
                  className={styles.mt2}
                />
              )}
              onChange={(event, newValue) => {
                setSelectedUser(newValue)
              }}
            />
            <Typography className={styles.mt2} variant={'h6'}>
              Borrowed Books:
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
                    {borrowedBooksContainer.map((book) => (
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
              Clear Borrowed Books
            </Button>
            <div className="mt-1"></div>
            <Button
              variant="contained"
              color="secondary"
              className={cx(styles.mt2, styles.bgSuccess)}
              style={{ padding: '10px' }}
              startIcon={<SendIcon />}
              disabled={(borrowedBooksContainer.length && selectedUser) <= 0}
              fullWidth
              onClick={BorrowBook}
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

export default Borrow
