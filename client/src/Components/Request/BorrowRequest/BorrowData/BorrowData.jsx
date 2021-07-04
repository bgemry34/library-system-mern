import { TableContainer,Dialog, DialogContent, DialogContentText, DialogActions, Button, Tooltip, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import React, {useState} from 'react'
import { formatDate } from '../../../../Tools/Tools';
import KeyboardReturnOutlinedIcon from '@material-ui/icons/KeyboardReturnOutlined';
import {returnBorrowedRequest} from './../../../../Api/Borrower/Borrower'


function BorrowData({data, status}) {
    const [borrows, setApproved, setReturned] = data;
    const [selectedRequest, setSelectedRequest] = useState({bookTitle:''});
    const [returnDialog, setReturnDialog] = useState(false);
    const [processing, setProcessing] = useState(false);

    const _returnBorrowedRequest = async () =>{
        setProcessing(true);
        try{
            const res = await returnBorrowedRequest(selectedRequest);
            if(res.status === 200){
            setReturned(c=>[res.data, ...c]);
            setApproved(a=>{
                return a.filter(_a=>{
                    return _a.id !== selectedRequest.id
                })
            })
            setReturnDialog(false);
            setSelectedRequest({bookTitle:''})
        }
        }catch(e){
            console.log(e)
        }
        setProcessing(false);
    }

    const getActionByStatus = (borrow) =>{
        switch(status){
            case "approved":
                return (
                    <>
                    <Tooltip title="Set As Returned">
                     <KeyboardReturnOutlinedIcon style={{color:'#27ae60' , marginLeft:'5px', cursor:'pointer'}} 
                     onClick={()=>{
                        setSelectedRequest(borrow)
                        setReturnDialog(true)
                     }}
                     />
                     </Tooltip>
                    </>
                 )
            // case "approved":
            //     return (
            //         <>
            //             <Tooltip title="Set As Cancell">
            //             <CloseIcon style={{color:'#e74c3c' , marginLeft:'5px', cursor:'pointer'}} 
            //             onClick={()=>{
            //                 console.log(borrow.id)
            //             }}
            //             />
            //             </Tooltip>
            //         </>
            //         )
            // case "cancelled":
            //     return (
            //         <>
            //             <Tooltip title="Set as Approved">
            //                 <CheckIcon style={{color:'#27ae60' , marginLeft:'5px', cursor:'pointer'}} 
            //                 onClick={()=>{
            //                     console.log(borrow.id)
            //                 }}
            //                 />
            //             </Tooltip>
            //         </>
            //         )
             default:
        }
    }

    

    const returnModal = (
        <div>
                <Dialog
                open={returnDialog}
                onClose={()=>{
                    setSelectedRequest({bookTitle:''})
                    setReturnDialog(false);
                }}
                maxWidth={'xs'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogContent>
                    <KeyboardReturnOutlinedIcon
                    style={{
                        color:'#2ecc71' ,
                         marginLeft:'auto',
                         marginRight:'auto',
                        textAlign:'center', 
                        display:'block',
                        fontSize:'250px'}} />
                    <DialogContentText style={{textAlign:'center'}} id="alert-dialog-description">
                        Are you sure you want to return <strong>{selectedRequest.bookTitle}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                    onClick={()=>{
                        _returnBorrowedRequest();
                    }}
                    disabled={processing}
                    color="primary">
                    Proceed
                    </Button>
                    <Button  color="primary" autoFocus 
                    disabled={processing}
                    onClick={()=>{
                        setSelectedRequest({bookTitle:''})
                        setReturnDialog(false);
                    }}
                    >
                    No
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
    )

    return (
        <div>
            <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell><strong>Borrower's Name</strong></TableCell>
                            <TableCell><strong>Book Title</strong></TableCell>
                            <TableCell><strong>Borrowed Date</strong></TableCell>
                            <TableCell><strong>Returned Date</strong></TableCell>
                            {status !=='pending' ? '' : (<TableCell align="center"><strong>Action</strong></TableCell>)}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {borrows.map(borrow=>(
                                <TableRow key={borrow.id}>
                                    <TableCell>{borrow.user.name}</TableCell>
                                    <TableCell>{borrow.bookTitle}</TableCell>
                                    <TableCell>{formatDate(borrow.dateBorrowed)}</TableCell>
                                    <TableCell>{formatDate(borrow.returnDate)}</TableCell>
                                    <TableCell align="center">
                                        <div className="">
                                       {getActionByStatus(borrow)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {returnModal}
                </TableContainer>
        </div>
    )
}

export default BorrowData
