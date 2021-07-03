import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import {
  fetchPending,
  fetchApproved,
  fetchCancell,
} from './../../../Api/Borrower/Borrower'
import BorrowData from './BorrowData/BorrowData'
import { checkToken } from '../../../Api/Users/Users'
import { useHistory } from 'react-router'

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
  const [value, setValue] = React.useState(0)
  const [pendings, setPendings] = useState([])
  const [approves, setApproved] = useState([])
  const [cancels, setCancels] = useState([])
  const [user, setUser] = useState(null)
  const history = useHistory()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await checkToken()
      if (res === undefined) history.push('/')
      else if (res.status === 401) history.push('/')
      setUser(res.data)
    }
    fetchUser()
  }, [history])

  useEffect(() => {
    let isCancelled = false
    const filterStudents = (data) => {
      return data.filter((data) =>
        user.userType === 'student'
          ? data.user.username === user.username
          : true
      )
    }
    const fetchApi = async () => {
      let pendingData = await fetchPending()
      let approvedData = await fetchApproved()
      let cancellData = await fetchCancell()
      if (!isCancelled) {
        setPendings(filterStudents(pendingData))
        setApproved(filterStudents(approvedData))
        setCancels(filterStudents(cancellData))
      }
    }
    try {
      fetchApi()
    } catch (e) {}

    return () => (isCancelled = true)
  }, [user])

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
          <Tab label="Pending" {...a11yProps(0)} />
          <Tab label="Approved" {...a11yProps(1)} />
          <Tab label="Cancelled" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <BorrowData
            borrows={pendings}
            status={'pending'}
            userType={user && user.userType}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <BorrowData
            borrows={approves}
            status={'approved'}
            userType={user && user.userType}
          />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <BorrowData
            borrows={cancels}
            status={'cancelled'}
            userType={user && user.userType}
          />
        </TabPanel>
      </SwipeableViews>
    </div>
  )
}
