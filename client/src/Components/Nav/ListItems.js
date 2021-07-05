import React from 'react'
import { NavLink } from 'react-router-dom'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import {
  Assignment as AssignmentIcon,
  AssignmentReturn as AssignmentReturnIcon,
  //AssignmentReturned as AssignmentReturnedIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  LibraryAdd as LibraryAddIcon,
  People as PeopleIcon,
  Search as SearchIcon,
} from '@material-ui/icons'

export const adminListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/books"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <LibraryAddIcon />
      </ListItemIcon>
      <ListItemText primary="Book Management" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/requests"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Borrow Requests" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/borrow"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <AssignmentReturnIcon />
      </ListItemIcon>
      <ListItemText primary="Borrow Book" />
    </ListItem>

    {/* <ListItem
      button
      component={NavLink}
      to="/return"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <AssignmentReturnedIcon />
      </ListItemIcon>
      <ListItemText primary="Return Book" />
    </ListItem> */}

    <ListItem
      button
      component={NavLink}
      to="/users"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="User Management" />
    </ListItem>
  </div>
)

export const studentListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/requests"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Borrow Requests" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/reserve"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Reserve Book" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/books"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <SearchIcon />
      </ListItemIcon>
      <ListItemText primary="Search Book" />
    </ListItem>
  </div>
)

export const secondaryListItems = (
  <div>
    {/* <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Missing Items" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText>
        <Typography >
          Returns and 
        </Typography>
        <Typography>
          Defective Items
        </Typography>
      </ListItemText>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Receivee History" />
    </ListItem> */}
  </div>
)
