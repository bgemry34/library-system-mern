import { Container, Grid, TextField } from '@material-ui/core'
import React from 'react'

function ReturnBook() {
  return (
    <div>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <div>
              <TextField
                fullWidth
                id="standard-basic"
                label="Find borrowed book..."
              />
            </div>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default ReturnBook
