
    import React, {useState, useEffect} from 'react'
    import styles from './Borrow.module.css';
    import {fetchBooks} from '../../Api/Books/Books'
    import AddIcon from '@material-ui/icons/Add';
    import { Container, Grid, TextField, TableContainer, Paper, Table, Button, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
    import {fetchUsers} from './../../Api/Users/Users'
    import Autocomplete from "@material-ui/lab/Autocomplete";
    import ClearIcon from '@material-ui/icons/Clear';
    import {formatDate} from './../../Tools/Tools'
    import SendIcon from '@material-ui/icons/Send';
    import cx from 'classnames'
    

    function Borrow() {
        const [books, setBooks] = useState([]);
        const [borrowedBooksContainer, setBorrowedBooksContainer] = useState([])
        const [users, setUsers] = useState([]);

        useEffect(()=>{
            let isCancelled = false;
            
            const fetchApi = async () =>{
                let booksData = await fetchBooks();
                let usersData = await fetchUsers();
                if(!isCancelled){
                    setBooks(booksData);
                    setUsers(usersData);
                }
            }
            try{
                fetchApi();
            }catch(e){
                console.log(e)
            }

            return ()=>isCancelled=true;
        }, [])

        const getStatusStyle =  (status) =>{
            if(status.toLowerCase() === 'available')
            return {color:'#2ecc71', fontWeight:'bold', textTransform:'capitalize'}
            else if(status.toLowerCase() === 'borrowed')
            return {color:'#e74c3c', fontWeight:'bold',  textTransform:'capitalize'}
            else if(status.toLowerCase() === 'reserved')
            return {color:'#f1c40f', fontWeight:'bold',  textTransform:'capitalize'}
        }

        const addBorrowBook = (book)=>{
            setBorrowedBooksContainer([book,...borrowedBooksContainer])
            setBooks(books.filter(_book=>_book.id!==book.id))
        }

        const revertBook = (book)=>{
            setBooks([book,...books])
            setBorrowedBooksContainer(borrowedBooksContainer.filter(_book=>_book.id!==book.id))
        }

        const clearBorrowBooks = ()=>{
            setBooks([...borrowedBooksContainer, ...books])
            setBorrowedBooksContainer([])            
        }

        return (
            <div>
                <Container className={styles.Container}  >
                    {/* <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                className={[styles.mt2, styles.floatRight]}
                                style={{padding: '10px'}}
                                startIcon={<SendIcon />}
                            >
                                Borrow Book Requests
                            </Button>
                        </Grid>
                    </Grid> */}
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
                                        {books.map(book=>(
                                            <TableRow key={book.id}>
                                                <TableCell>{book.title}</TableCell>
                                                <TableCell style={getStatusStyle(book.status)}>{book.status}</TableCell>
                                                <TableCell align="center">
                                                    {book.status.toLowerCase() === 'available'?(
                                                        <AddIcon style={{color:'#27ae60' , marginLeft:'5px', cursor:'pointer'}} 
                                                        onClick={()=>addBorrowBook(book)}
                                                        />
                                                    ):''}
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
                            id="country-select-demo"
                            style={{ width: 300 }}
                            options={users}
                            autoHighlight
                            className={styles.borrowersNameContainer}
                            getOptionLabel={(option) => option.name}
                            renderOption={(option) => option.name}
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Choose a borrower"
                                variant="outlined"
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                                />
                            )}
                            />

                        <TextField
                            id="date"
                            label="Borrow Date"
                            type="standard"
                            defaultValue={formatDate(new Date())}
                            className={styles.mt2}
                            InputProps={{
                                readOnly: true,
                            }}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            fullWidth
                        />
                        <Typography className={styles.mt2} variant={'h6'}>Borrowed Books:</Typography>
                        {/* Borrow book section */}
                        <div className={styles.borrowedBookContainer}>
                            <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {borrowedBooksContainer.map(book=>(
                                                <TableRow key={book.id}>
                                                    <TableCell>{book.title}</TableCell>
                                                    <TableCell align="center">
                                                           {book.status.toLowerCase() === 'available'?(
                                                            <ClearIcon style={{color:'#e74c3c' , marginLeft:'5px', cursor:'pointer'}} 
                                                            onClick={()=>{revertBook(book)}}
                                                            />
                                                        ):''}
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
                            onClick={()=>{clearBorrowBooks()}}
                        >
                            Clear Borrowed Books
                        </Button>
                        <div className="mt-1"></div>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={cx(styles.mt2, styles.bgSuccess)}
                            style={{padding: '10px'}}
                            startIcon={<SendIcon />}
                            fullWidth
                        >
                            Submit
                        </Button>

                        </Grid>
                    </Grid>
                </Container>
            </div>
        )
    }

    export default Borrow
