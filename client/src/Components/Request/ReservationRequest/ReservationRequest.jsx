import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import ReservationData from './ReservationData/ReservationData'
import {
  fetchPending,
  fetchApproved,
  fetchCancelled,
} from './../../../Api/Reservation/Reservation'

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
      {value === index && <Box p={3}>{children}</Box>}
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

  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      const pendingData = await fetchPending()
      const approvedData = await fetchApproved()
      const cancelData = await fetchCancelled()
      if (!isCancelled) {
        setPendings(pendingData)
        setApproved(approvedData)
        setCancels(cancelData)
      }
    }
    fetchApi()
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
          <ReservationData
            data={[pendings, setPendings, setApproved, setCancels]}
            status={'pending'}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <ReservationData
            data={[approves, setPendings, setApproved, setCancels]}
            status={'approved'}
          />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <ReservationData
            data={[cancels, setPendings, setApproved, setCancels]}
            status={'cancel'}
          />
        </TabPanel>
      </SwipeableViews>
    </div>
  )
}
