import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';


import LoginPage from './pages/LoginPage';
import EventPage from './pages/EventPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';



function App() {
 return (
   <Router>
     <Switch>
       <Route path="/" exact>
         <LoginPage/>
       </Route>
       
       <Route path="/events" exact>
         <EventPage/>
       </Route>
       
       <Route path = "/register" exact>
          <RegisterPage/>
       </Route>
       
       <Route path = "/createevent" exact>
        <CreateEventPage/>
       </Route>
       
       <Redirect to="/" />
     </Switch>
   </Router>
     );
}


export default App;
