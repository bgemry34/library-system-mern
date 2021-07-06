import { Button, 
    Container, 
    Grid,
    Paper, 
    TextField,
    TableBody, 
    TableRow, 
    TableCell,
    Table,
    TableContainer,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    DialogActions,
    MenuItem,
    DialogContentText,
    TableHead} from '@material-ui/core';
import React, {useEffect, useState} from 'react';

import PrintIcon from '@material-ui/icons/Print';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SaveIcon from '@material-ui/icons/Save';

import {fetchItems, createItem, deleteItem, updateItem, searchItems} from './../../Api/inventory';
import {fetchDepartment} from './../../Api/department';
import {fetchCompany} from './../../Api/company';
import {debounce} from 'lodash'

function Inventory() {

    useEffect(()=>{
        const fetchApi = async () => {
            try{
                const itemData =  await fetchItems();
                const departmentData = await fetchDepartment();
                const companyData = await fetchCompany();

                setItems(itemData.data);
                setCompanies(companyData.data);
                setDepartments(departmentData.data);
            }catch(e){
                console.log(e);
                setItems([]);
                setCompanies([]);
                setDepartments([]);
            }
            
        }
        fetchApi();
    },[]);

    

    const [items, setItems] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [createModal, setCreateModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const [printModal, setPrintModal] = useState(false);

    useEffect(()=>{
        let isCancelled = false;
        const fetchSearch = async () =>{
          try{
            let items = searchItem.trim() !== '' ? await searchItems(searchItem) : await fetchItems();
            if(!isCancelled){
              setItems(items.data);
            }
          }catch(e){
              console.log(e)
          }
        }
        if(searchItem.trim() !== '')
        fetchSearch();
        else

        return ()=>isCancelled = true
      }, [searchItem])
    

    const [form, setForm] = useState({
        name:'',
        company:'',
        qty:'',
        model:'',
        price:'',
        depre_price:'',
        department:'',
        purchase_order_no:'',
        onProcess:false
    });


    const clearForm = () =>{
        setForm({
            id:'',
            name:'',
            company:'',
            qty:'',
            model:'',
            price:'',
            depre_price:'',
            department:'',
            purchase_order_no:'',
            onProcess:false
        });
    };


    const addItem = async (e) => {
        e.preventDefault();
        try{
            const {name, company, department, qty, price, depre_price, purchase_order_no, model} = form;
            setForm({...form, onProcess:true})
            const res = !isEdit ? await createItem(
                name, company, department, qty, price, depre_price, purchase_order_no, model
            ) : await updateItem(form);
            if(res.status===200){
                setForm({...form, onProcess:false});
                if(!isEdit)
                    setItems([...items, res.data.data]);
                else
                    setItems(items.map(item=>{
                    // eslint-disable-next-line
                    return item.id==form.id ? form : item;
                }));
                clearForm();
                setCreateModal(false)
            }else{
                setForm({...form, onProcess:false});
                clearForm();
                setCreateModal(false)
            }
        }catch(e){
            console.log(e);
            setForm({
                id:'',
                name:'',
                company:'',
                qty:'',
                model:'',
                price:'',
                depre_price:'',
                department:'',
                purchase_order_no:'',
                onProcess:false
            });
            setForm({...form, onProcess:false});
            setCreateModal(false);
        }
    }
    
   
    const removeItem = async () => {
       try{
            const res = await deleteItem(form.id);
            if(res.status === 200){
                setItems(items.filter(item=>item.id!==form.id));
                setConfirmDeleteModal(false);
                setForm({
                    id:'',
                    name:'',
                    company:'',
                    qty:'',
                    model:'',
                    price:'',
                    depre_price:'',
                    department:'',
                    purchase_order_no:'',
                    onProcess:false
                });
            }else{
                setConfirmDeleteModal(false);
                alert('something went wrong!');
            }
       }catch(e){
           console.log(e);
           setConfirmDeleteModal(false);
           setForm({
               id:'',
               name:'',
               company:'',
               qty:'',
               model:'',
               price:'',
               depre_price:'',
               department:'',
               purchase_order_no:'',
               onProcess:false
           });
       }
    }


    const handleChange = (e) =>{
        setForm({...form, [e.target.name]:e.target.value});
    };

    const searchChange = debounce((text) =>{
        setSearchItem(text)
    }, 1500)

      const addDialog = (
        <Dialog
          open={createModal}
          onClose={()=>{
              setIsEdit(false);
              setCreateModal(false);
              clearForm();
          }}
          scroll="body"
          fullWidth
        >
          <form onSubmit={addItem} method="post">
            <DialogTitle className="mt-2">{isEdit ? 'Edit' : 'Add'} Item</DialogTitle>
            <DialogContent>
                <Container>
                    <FormControl margin="normal" fullWidth>
                    <TextField
                    required
                    name="name"
                    label="Name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                    <TextField
                    required
                    name="model"
                    label="Model"
                    type="text"
                    value={form.model}
                    onChange={handleChange}
                    fullWidth
                    />
                    </FormControl>
                    
                    <FormControl margin="normal" fullWidth>
                        <TextField
                        select
                        margin="normal"
                        label="Company"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        required
                        fullWidth
                        >
                            <MenuItem value={' '}>
                                {'--Select Company--'}
                            </MenuItem>
                            {companies.length >0  && companies.map(company=>(
                            <MenuItem key={company.id} value={company.name}>
                                {company.name}
                            </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                        select
                        margin="normal"
                        label="Department"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        required
                        fullWidth
                        >
                            <MenuItem value={' '}>
                                {'--Select Company--'}
                            </MenuItem>
                            {departments.length >0  && departments.map(department=>(
                            <MenuItem key={department.id} value={department.name}>
                                {department.name}
                            </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="qty"
                            label="Qty"
                            type="number"
                            value={form.qty}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="price"
                            label="Price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="depre_price"
                            label="Depreciate Price"
                            type="number"
                            value={form.depre_price}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="purchase_order_no"
                            label="Purchase order no."
                            type="text"
                            value={form.purchase_order_no}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>

                </Container>
            </DialogContent>
            <DialogActions>
                <Container>
                    {
                        isEdit ? (
                        <Button
                        id='addBtn'
                        variant="contained"
                        color="primary"
                        style={{float:'right', marginRight:'15px', marginBottom: '5px'}}
                        endIcon={<SaveIcon />}
                        disabled={form.onProcess}
                        size="large"
                        type="submit"
                        >
                            Save
                        </Button> 
                        ) : 
                        (
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
                        )
                    }
                        
                </Container>
            </DialogActions>
          </form>
        </Dialog>
    );

    const showDialog = (
        <Dialog
          open={showModal}
          onClose={()=>{
              setIsEdit(false);
              setShowModal(false);
              clearForm();
          }}
          scroll="body"
          fullWidth
        >
          <form method="post">
            <DialogTitle className="mt-2">Show Item</DialogTitle>
            <DialogContent>
                <Container>
                    <FormControl margin="normal" fullWidth>
                    <TextField
                    required
                    name="name"
                    label="Name"
                    type="text"
                    value={form.name}
                    InputProps={{
                        readOnly: true,
                      }}
                    fullWidth
                    />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                    <TextField
                    required
                    name="model"
                    label="Model"
                    type="text"
                    value={form.model}
                    InputProps={{
                        readOnly: true,
                      }}
                    fullWidth
                    />
                    </FormControl>
                    
                    <FormControl margin="normal" fullWidth>
                        <TextField
                        select
                        margin="normal"
                        label="Company"
                        name="company"
                        value={form.company}
                        InputProps={{
                            readOnly: true,
                          }}
                        required
                        fullWidth
                        >
                            <MenuItem value={' '}>
                                {'--Select Company--'}
                            </MenuItem>
                            {companies.length >0  && companies.map(company=>(
                            <MenuItem key={company.id} value={company.name}>
                                {company.name}
                            </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                        select
                        margin="normal"
                        label="Department"
                        name="department"
                        value={form.department}
                        InputProps={{
                            readOnly: true,
                          }}
                        required
                        fullWidth
                        >
                            <MenuItem value={' '}>
                                {'--Select Company--'}
                            </MenuItem>
                            {departments.length >0  && departments.map(department=>(
                            <MenuItem key={department.id} value={department.name}>
                                {department.name}
                            </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="qty"
                            label="Qty"
                            type="number"
                            value={form.qty}
                            InputProps={{
                                readOnly: true,
                              }}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="price"
                            label="Price"
                            type="number"
                            value={form.price}
                            InputProps={{
                                readOnly: true,
                              }}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="depre_price"
                            label="Depreciate Price"
                            type="number"
                            value={form.depre_price}
                            InputProps={{
                                readOnly: true,
                              }}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl margin="normal" fullWidth>
                        <TextField
                            required
                            name="purchase_order_no"
                            label="Purchase order no."
                            type="text"
                            value={form.purchase_order_no}
                            InputProps={{
                                readOnly: true,
                              }}
                            fullWidth
                        />
                    </FormControl>

                </Container>
            </DialogContent>
            <DialogActions>
            </DialogActions>
          </form>
        </Dialog>
    );

    const confirmDelete = (
        <Dialog
        open={confirmDeleteModal}
        onClose={()=>{
            setConfirmDeleteModal(false)
            clearForm();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Confirm Delete?</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Do you want to delete {form.name} ?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>removeItem(form.id)} color="primary">
                Yes
            </Button>
            <Button onClick={()=>setConfirmDeleteModal(false)} color="primary" autoFocus>
                Cancel
            </Button>
            </DialogActions>
        </Dialog>
    );

    const printItemsModal = (
        <Dialog
          open={printModal}
          onClose={()=>setPrintModal(false)}
          scroll="body"
          fullWidth
        >
          <form method="post">
            <DialogTitle className="mt-2">Print: Generate PDF</DialogTitle>
            <DialogContent>
                <Container>
                    <FormControl margin="normal" fullWidth>
                        <TextField
                        select
                        margin="normal"
                        label="Department"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        required
                        fullWidth
                        >
                            <MenuItem value={' '}>
                                {'--Select Department--'}
                            </MenuItem>
                            {departments.length >0  && departments.map(department=>(
                            <MenuItem key={department.id} value={department.name}>
                                {department.name}
                            </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                </Container>
            </DialogContent>
            <DialogActions>
                <Container>
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
                            Print
                        </Button> 
                </Container>
            </DialogActions>
          </form>
        </Dialog>
    )

    return (
        <div>
           <Container>
           <Grid container style={{marginTop:'20px'}}>
                <Grid item xs={5}>
                        <TextField
                        name="search"  
                        onChange={(e)=>searchChange(e.target.value)}
                        label="Search..." />
                </Grid>
                <Grid item xs={7}>
                    <div style={{float:'right', marginTop: '15px'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<PrintIcon />}
                        onClick={()=>{
                            setPrintModal(true);
                        }}
                    >
                        Print
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{marginLeft:'10px', backgroundColor:'#2ecc71'}}
                        endIcon={<AddIcon />}
                        onClick={()=>setCreateModal(true)}
                    >
                        Add
                    </Button>
                    </div>
                </Grid>
            </Grid>
            <Grid container style={{marginTop:'30px'}}>
                <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Qty.</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell style={{textAlign:'center'}}>Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {items.map(item=>(
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell >{item.company}</TableCell>
                                <TableCell>{item.qty}</TableCell>
                                <TableCell >{item.price}</TableCell>
                                <TableCell>{item.department}</TableCell>
                                <TableCell >
                                    <div style={{textAlign:'center'}}>
                                    <VisibilityIcon 
                                    style={{color:'#2980b9' , 
                                    marginRight:'10px', 
                                    cursor:'pointer'}}
                                    onClick={()=>{
                                        setForm(item);
                                        setShowModal(true);
                                    }}
                                    />
                                    <EditIcon 
                                    style={{color:'#2ecc71' , 
                                    marginRight:'5px', 
                                    cursor:'pointer'}}
                                    onClick={()=>{
                                        setIsEdit(true);
                                        setCreateModal(true);
                                        setForm(item);
                                    }} 
                                    />
                                    <DeleteIcon  
                                    style={{color:'#e74c3c' , marginLeft:'5px', cursor:'pointer'}}
                                    onClick={()=>{
                                        setConfirmDeleteModal(true);
                                        setForm(item);
                                    }}
                                    />
                                    </div>
                                </TableCell>
                             </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
            </Grid>
           </Container>
           {addDialog}
           {confirmDelete}
           {showDialog}
           {printItemsModal}
        </div>
    )
}

export default Inventory
