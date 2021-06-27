import { TableContainer, Tooltip, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import React from 'react'
import { formatDate } from '../../../../Tools/Tools';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {approvedBorrowedRequest, cancelBorrowedRequest} from './../../../../Api/Borrower/Borrower'


function Pending({borrows, status}) {
    const getActionByStatus = (borrow) =>{
        switch(status){
            case "pending":
                return (
                    <>
                    <Tooltip title="Set As Approved">
                     <CheckIcon style={{color:'#27ae60' , marginLeft:'5px', cursor:'pointer'}} 
                     onClick={()=>{
                         console.log(borrow.id)
                     }}
                     />
                     </Tooltip>
                     <Tooltip title="Set As Cancell">
                     <CloseIcon style={{color:'#e74c3c' , marginLeft:'5px', cursor:'pointer'}} 
                     onClick={()=>{
                         console.log(borrow.id)
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
    return (
        <div>
            <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell><strong>Borrower's Name</strong></TableCell>
                            <TableCell><strong>Book Title</strong></TableCell>
                            <TableCell><strong>Borrowed Date</strong></TableCell>
                            {status !=='pending' ? '' : (<TableCell align="center"><strong>Action</strong></TableCell>)}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {borrows.map(borrow=>(
                                <TableRow key={borrow.id}>
                                    <TableCell>{borrow.user.name}</TableCell>
                                    <TableCell>{borrow.bookTitle}</TableCell>
                                    <TableCell>{formatDate(borrow.dateBorrowed)}</TableCell>
                                    <TableCell align="center">
                                       {getActionByStatus(borrow)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        </div>
    )
}

export default Pending
