
import React, {useState, useEffect} from 'react'
import styles from './Borrow.module.css';
import {fetchBooks} from '../../Api/Books/Books'
import { formatDate } from '../../Tools/Tools';
import AddIcon from '@material-ui/icons/Add';
import { Container, Grid, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';

function Borrow() {
    let isCancelled = false;
    const [books, setBooks] = useState([]);
    const [borrowedBooksContainer, setBorrowedBooksContainer] = useState([])

    useEffect(()=>{
        let isCancelled = false;
        
        const fetchApi = async () =>{
            let booksData = await fetchBooks();
            if(!isCancelled){
                setBooks(booksData);
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

    return (
        <div>
            <Container className={styles.Container}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item xs={6}>
                        <TextField id="standard-basic" fullWidth label="Search Book" />
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
                                                    onClick={()=>{
                                                        console.log('added')
                                                    }}
                                                    />
                                                ):''}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </div>
                        <Typography variant={'h6'}>Borrowed Books:</Typography>
                        <div className={styles.borrowedBookContainer}>
                            
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Borrow
