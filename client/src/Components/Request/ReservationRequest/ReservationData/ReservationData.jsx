import {
  TableContainer,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { formatDate } from '../../../../Tools/Tools'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import {
  cancelReservationRequest,
  approvedReservationRequest,
} from './../../../../Api/Reservation/Reservation'


function ReservationData({ data, status }) {
  const [reserves, setPendings, setApproved, setCancels] = data
  const [selectedReserved, setSelectedReserved] = useState({ bookTitle: '' })
  const [processing, setProcessing] = useState(false)

  const [approvedDialog, setApprovedDialog] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false);
  const [_user, setUser] = useState({userType:''});

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')));
  }, [])

  const _approvedReservationRequest = async () => {
    setProcessing(true)
    const res = await approvedReservationRequest(selectedReserved)
    try {
      if (res.status === 200) {
        setApproved((p) => [res.data, ...p])
        setPendings((a) => {
          return a.filter((_a) => {
            return _a.id !== selectedReserved.id
          })
        })
        setApprovedDialog(false)
        setSelectedReserved({ bookTitle: '' })
      }
    } catch (e) {
      console.log(e)
    }
    setProcessing(false)
  }

  const _cancelReservationRequest = async () => {
    setProcessing(true)
    const res = await cancelReservationRequest(selectedReserved)
    try {
      if (res.status === 200) {
        setCancels((p) => [res.data, ...p])
        setPendings((a) => {
          return a.filter((_a) => {
            return _a.id !== selectedReserved.id
          })
        })
        setCancelDialog(false)
        setSelectedReserved({ bookTitle: '' })
      }
    } catch (e) {
      console.log(e)
    }
    setProcessing(false)
  }

  const getActionByStatus = (reserve) => {
    switch (status) {
      case 'pending':
        return (
          <>
            <Tooltip title="Set As Approved">
              <CheckIcon
                style={{
                  color: '#27ae60',
                  marginLeft: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedReserved(reserve)
                  setApprovedDialog(true)
                }}
              />
            </Tooltip>
            <Tooltip title="Set As Cancelled">
              <ClearIcon
                style={{
                  color: '#c0392b',
                  marginLeft: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedReserved(reserve)
                  setCancelDialog(true)
                }}
              />
            </Tooltip>
          </>
        )
      default:
    }
  }

  const checkTableUser = () => {
    if (_user) {
      if (_user.userType === 'admin') {
        return (
          <TableCell align="center">
            <strong>Action</strong>
          </TableCell>
        )
      }
    }
  }
  const checkTableCellUser = (reserve) => {
    if (_user) {
      if (_user.userType === 'admin') {
        return (
          <TableCell align="center">
            <div className="">{getActionByStatus(reserve)}</div>
          </TableCell>
        )
      }
    }
  }

  const approvedModal = (
    <div>
      <Dialog
        open={approvedDialog}
        onClose={() => {
          setSelectedReserved({ bookTitle: '' })
          setApprovedDialog(false)
        }}
        maxWidth={'xs'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <CheckIcon
            style={{
              color: '#2ecc71',
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
            Are you sure you want to approved{' '}
            <strong>{selectedReserved.bookTitle}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              _approvedReservationRequest()
            }}
            disabled={processing}
            color="primary"
          >
            Proceed
          </Button>
          <Button
            color="primary"
            autoFocus
            disabled={processing}
            onClick={() => {
              setSelectedReserved({ bookTitle: '' })
              setApprovedDialog(false)
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

  const cancelModal = (
    <div>
      <Dialog
        open={cancelDialog}
        onClose={() => {
          setSelectedReserved({ bookTitle: '' })
          setCancelDialog(false)
        }}
        maxWidth={'xs'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <ClearIcon
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
            Are you sure you want to cancel{' '}
            <strong>{selectedReserved.bookTitle}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              _cancelReservationRequest()
            }}
            disabled={processing}
            color="primary"
          >
            Proceed
          </Button>
          <Button
            color="primary"
            autoFocus
            disabled={processing}
            onClick={() => {
              setSelectedReserved({ bookTitle: '' })
              setCancelDialog(false)
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
              <TableCell><strong>Students Name</strong></TableCell>
              <TableCell><strong>Book Title</strong></TableCell>
              {status === 'cancel' ? (
                <TableCell><strong>Date Cancelled</strong></TableCell>
              ) : (
                <TableCell><strong>Reservation Date</strong></TableCell>
              )}
              {status === 'pending' ? checkTableUser() : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {reserves.map((reserve) => (
              <TableRow key={reserve.id}>
                <TableCell>{reserve.user.name}</TableCell>
                <TableCell>{reserve.bookTitle}</TableCell>
                {status === 'cancel' ? (
                  <TableCell>{formatDate(reserve.cancelledDate)}</TableCell>
                ) : (
                  <TableCell>{formatDate(reserve.reservationDate)}</TableCell>
                )}
                {checkTableCellUser(reserve)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {approvedModal}
        {cancelModal}
        {}
      </TableContainer>
    </div>
  )
}

export default ReservationData
