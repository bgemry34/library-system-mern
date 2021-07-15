import React from 'react'
import { NavLink } from 'react-router-dom'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import {
  Assignment as AssignmentIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  LibraryAdd as LibraryAddIcon,
  People as PeopleIcon,
  Search as SearchIcon,
} from '@material-ui/icons'
import GitHubIcon from '@material-ui/icons/GitHub'

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
      to="/requests"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Requests" />
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
      <ListItemText primary="Requests" />
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
    <ListItem
      button
      component="a"
      href="https://github.com/bgemry34/library-system-mern"
      target="_blank"
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <GitHubIcon />
      </ListItemIcon>
      <ListItemText primary="View Code" />
    </ListItem>
  </div>
)
