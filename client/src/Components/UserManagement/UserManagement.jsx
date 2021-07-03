import React from 'react'

import {
    // Paper, 
    Grid,
    TextField, 
    // TableContainer,
    // Table, 
    // TableHead, 
    // TableRow, 
    // TableCell, 
    // DialogTitle,
    // Dialog,
    // DialogContent,
    // FormControl,
    // DialogActions,
    // DialogContentText,
    // TableBody
    Container
} from '@material-ui/core';

function UserManagement() {
    return (
        <div>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                    <div>
                        <TextField fullWidth id="standard-basic" label="Find User..." />
                    </div>
                    </Grid>
                    <Grid item xs={6}></Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default UserManagement
