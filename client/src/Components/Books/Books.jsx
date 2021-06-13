import React from 'react'
import {Paper, 
    Grid, 
    TextField, 
    TableContainer,
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody} from '@material-ui/core';
import { Container, Button } from '@material-ui/core';
import styles from './Books.module.css';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/EditAttributesTwoTone';

function Books() {
    return (
        <div>
            <Container>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <div className={styles.w60}>
                        <TextField fullWidth id="standard-basic" label="Find Book..." />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Grid 
                    container
                    direction="row-reverse"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}>
                        <Grid item xs={4} >
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.btnAdd}
                            endIcon={<AddIcon />}
                            fullWidth
                        >
                            Add Book
                        </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container style={{marginTop:'30px'}}>
                <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Date Created</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* {companies.map(company=>(
                                <TableRow key={company.id}>
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell align="center">
                                        <EditIcon 
                                        style={{color:'#2ecc71' , 
                                        marginRight:'5px', 
                                        cursor:'pointer'}} 
                                        onClick={()=>{
                                            setIsEdit(true);
                                            setCreateModal(true);
                                            setForm(company)
                                        }} />
                                        <DeleteIcon onClick={()=>{
                                            removeCompany(company.id)
                                        }} style={{color:'#e74c3c' , marginLeft:'5px', cursor:'pointer'}} />
                                    </TableCell>
                                </TableRow>
                            ))} */}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
            </Grid>
            </Container>
        </div>
    )
}

export default Books
