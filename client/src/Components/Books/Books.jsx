import React, { useState, useEffect } from 'react'
import {
  Paper,
  Grid,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  DialogTitle,
  Dialog,
  DialogContent,
  FormControl,
  DialogActions,
  DialogContentText,
  TableBody,
  Container,
  Button,
} from '@material-ui/core'
import styles from './Books.module.css'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import { useForm } from './../../Custom-Hook/userForm'
import {
  fetchBooks,
  createBook,
  editBook,
  deleteBook,
} from './../../Api/Books/Books'
import { checkToken } from '../../Api/Users/Users'
import { useHistory } from 'react-router'
import { formatDate } from './../../Tools/Tools'
import Alert from '@material-ui/lab/Alert'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import {debounce} from 'lodash';

function Books() {
  const [createModal, setCreateModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [books, setBooks] = useState([])
  const [alert, setAlert] = useState('')
  const [errorAlert, setErrorAlert] = useState('')
  const [processing, setProcessing] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [userType, setUserType] = useState(null)

  const history = useHistory()

  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      const res = await checkToken()
      if (res === undefined) history.push('/')
      else if (res.status === 401) history.push('/')

      if (!isCancelled) {
        setUserType(res.data.userType)
      }
    }
    try {
      fetchApi()
    } catch (e) {
      console.log(e)
    }
    return () => (isCancelled = true)
  }, [history])

  const [bookForm, handleChange, setBookForm] = useForm({
    title: '',
    author: '',
    genre: '',
  })

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

  const addBook = async (e) => {
    e.preventDefault()
    setProcessing(true)
    const res = isEdit ? await editBook(bookForm) : await createBook(bookForm)
    if (res.status === 200 || res.status === 201) {
      setCreateModal(false)
      if (isEdit) {
        setBooks(
          books.map((book) => (book.id === res.data.id ? res.data : book))
        )
        setAlert(<Alert severity="success">Successfully edited book.</Alert>)
      } else {
        setBooks([res.data, ...books])
        setAlert(<Alert severity="success">Successfully added new book.</Alert>)
      }
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

  const destroyBook = async () => {
    setProcessing(true)
    const res = await deleteBook(bookForm)
    if (res.status === 200 || res.status === 204) {
      setProcessing(false)
      setDeleteAlert(false)
      setBooks(books.filter((book) => book.id !== bookForm.id))
      setBookForm({ title: '', author: '', genre: '' })
      setErrorAlert(
        <Alert style={{ textTransform: 'capitalize' }} severity="error">
          You Have Successfully Delete Book.
        </Alert>
      )
      setTimeout(() => {
        setErrorAlert('')
      }, 10000)
    }
  }

  //Dialogs
  const addDialog = (
    <Dialog
      open={createModal}
      onClose={() => {
        setCreateModal(false)
        setBookForm({ title: '', author: '', genre: '' })
      }}
      scroll="body"
      fullWidth
    >
      <form onSubmit={addBook} method="post">
        <Container>
          <DialogTitle className="mt-2">
            {isEdit ? 'Edit' : 'Add'} Book
          </DialogTitle>
        </Container>
        <DialogContent>
          <Container>
            {errorAlert}
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="title"
                onChange={handleChange}
                value={bookForm.title}
                label="Title"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="author"
                onChange={handleChange}
                value={bookForm.author}
                label="Author"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="genre"
                onChange={handleChange}
                value={bookForm.genre}
                label="Genre"
                type="text"
                fullWidth
              />
            </FormControl>
          </Container>
        </DialogContent>
        <DialogActions>
          <Container>
            {!isEdit ? (
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
            ) : (
              <Button
                id="editBtn"
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px' }}
                endIcon={<SaveIcon />}
                disabled={processing}
                size="large"
                fullWidth
                type="submit"
              >
                Save
              </Button>
            )}
          </Container>
        </DialogActions>
      </form>
    </Dialog>
  )

  const deleteDialog = (
    <div>
      <Dialog
        open={deleteAlert}
        onClose={() => {
          setBookForm({ title: '', author: '', genre: '' })
          setDeleteAlert(false)
        }}
        maxWidth={'xs'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <CancelOutlinedIcon
            style={{
              color: '#e74c3c',
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'center',
              display: 'block',
              fontSize: '250px',
            }}
          />
          <DialogContentText
            style={{ textAlign: 'center' }}
            id="alert-dialog-description"
          >
            Are you sure you want to delete <strong>{bookForm.title}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              destroyBook()
            }}
            disabled={processing}
            color="primary"
          >
            Proceed
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={() => {
              setBookForm({ title: '', author: '', genre: '' })
              setDeleteAlert(false)
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

  const searchChange = debounce( async (text) =>{
    
    let isCancelled = false

    let booksData = await fetchBooks(text);
    console.log(booksData, text)
    if(!isCancelled)
    setBooks(booksData);

    return () => (isCancelled = true)
  }, 1500)

  return (
    <div>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <div className={styles.w60}>
              <TextField
               fullWidth 
               id="standard-basic" 
               onChange={(e)=>searchChange(e.target.value)}
               label="Find Book..." />
            </div>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="row-reverse"
              justify="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={4}>
                {userType === 'admin' && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.btnAdd}
                    endIcon={<AddIcon />}
                    onClick={() => {
                      setIsEdit(false)
                      setCreateModal(true)
                    }}
                    fullWidth
                  >
                    Add Book
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {alert}
        <Grid container style={{ marginTop: '30px' }}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Genre</TableCell>
                    <TableCell>Date Created</TableCell>
                    {userType === 'admin' && (
                      <TableCell align="center">Action</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.genre}</TableCell>
                      <TableCell>{formatDate(book.dateCreated)}</TableCell>
                      {userType === 'admin' && (
                        <TableCell align="center">
                          <EditIcon
                            style={{
                              color: '#27ae60',
                              marginLeft: '5px',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setIsEdit(true)
                              setBookForm(book)
                              setCreateModal(true)
                            }}
                          />
                          <DeleteIcon
                            style={{
                              color: '#e74c3c',
                              marginLeft: '5px',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setBookForm(book)
                              setDeleteAlert(true)
                            }}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {addDialog}
        {deleteDialog}
      </Container>
    </div>
  )
}

export default Books
