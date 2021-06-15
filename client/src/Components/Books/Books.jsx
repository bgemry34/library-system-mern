import React, {useState} from 'react'
import {Paper, 
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
    TableBody} from '@material-ui/core';
import { Container, Button } from '@material-ui/core';
import styles from './Books.module.css';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/EditAttributesTwoTone';
import SaveIcon from '@material-ui/icons/Save';
import {useForm} from './../../Custom-Hook/userForm';

function Books() {

    const [createModal, setCreateModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [values, handleChange] = useForm({email:'', password:'', usertype:''});

     //Dialogs
     const addDialog = (
        <Dialog
          open={createModal}
          onClose={()=>setCreateModal(false)}
          scroll="body"
          fullWidth
        >
          <form method="post">
            <DialogTitle className="mt-2">{isEdit ? 'Edit' : 'Add'} Book</DialogTitle>
            <DialogContent>
                <Container>
                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="name"
                            onChange = {handleChange}
                            value={values.name}
                            label="Name"
                            type="text"
                            fullWidth
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="author"
                            onChange = {handleChange}
                            value={values.name}
                            label="Author"
                            type="text"
                            fullWidth
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="genre"
                            onChange = {handleChange}
                            value={values.name}
                            label="Genre"
                            type="text"
                            fullWidth
                        />
                    </FormControl>
                </Container>
            </DialogContent>
            <DialogActions>
                <Container>
                    {/* {
                        !isEdit ? (
                        <Button
                        id='addBtn'
                        variant="contained"
                        color="primary"
                        style={{float:'right', marginRight:'15px', marginBottom: '5px'}}
                        endIcon={<AddIcon />}
                        disabled={form.onProcess}
                        size="large"
                        type="submit"
                        >
                            Add
                        </Button> 
                        ) : (
                        
                        )
                    }  */}
                    <Button
                        id='editBtn'
                        variant="contained"
                        color="primary"
                        
                        endIcon={<SaveIcon />}
                        size="large"
                        fullWidth
                        type="submit"
                        >
                            Save
                        </Button> 
                </Container>
            </DialogActions>
          </form>
        </Dialog>
    )

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
                            onClick={()=>setCreateModal(true)}
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
                            <TableCell>Author</TableCell>
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
            {addDialog}
            </Container>
        </div>
    )
}

export default Books
