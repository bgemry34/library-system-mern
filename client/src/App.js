import React from 'react'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Dashboard from './Components/Dashboard/Dashboard';
import Books from './Components/Books/Books';
import Borrow from './Components/Borrow/Borrow';


// import Dashboard from './Components/Dashboard/Das1board'


export default function App() {
  return (
    <Router>
        <Switch>
          <Route path="/" exact component={Login} />
                <Switch>
                  <Route path="/dashboard" exact >
                    <Nav>
                      <Dashboard />
                    </Nav>
                  </Route>
                  <Route path="/books" exact >
                    <Nav>
                      <Books />
                    </Nav>
                  </Route>
                  <Route path="/borrow" exact >
                    <Nav>
                      <Borrow />
                    </Nav>
                  </Route>
                  {/* <Route path="/department" exact >
                    <Nav>
                      <Department />
                    </Nav>
                  </Route>
                  <Route path="/users" exact >
                    <Nav>
                      <Users />
                    </Nav>
                  </Route> */}
                </Switch>
        </Switch>
    </Router> 
    
  )
}
