import { Container, Grid, TextField } from '@material-ui/core'
import React from 'react'
import styles from './Borrow.module.css';

function Borrow() {
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
                        <TextField id="standard-basic" fullWidth label="Standard" />
                    </Grid>
                    <Grid item xs={6}>
                        
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Borrow
