import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import { fetchApproved, fetchReturned } from './../../../Api/Borrower/Borrower'
import BorrowData from './BorrowData/BorrowData'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
}))

export default function ReservationRequest() {
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = useState(0)
  const [approves, setApproved] = useState([])
  const [returned, setReturned] = useState([])

  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      let approvedData = await fetchApproved()
      let returnedData = await fetchReturned()
      if (!isCancelled) {
        setApproved(approvedData)
        setReturned(returnedData)
      }
    }
    try {
      fetchApi()
    } catch (e) {}
    return () => (isCancelled = true)
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Approved" {...a11yProps(0)} />
          <Tab label="Returned" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <BorrowData
            data={[approves, setApproved, setReturned]}
            status={'approved'}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <BorrowData
            data={[returned, setApproved, setReturned]}
            status={'returned'}
          />
        </TabPanel>
      </SwipeableViews>
    </div>
  )
}
