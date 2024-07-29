import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './App.css';


import LoginPage from './pages/LoginPage';
import EventPage from './pages/EventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventPage from './pages/MyEventPage';
import UpdateEventPage from './pages/UpdateEventPage';

function App() {
 return (
   <Router>
     <Switch>
       <Route path="/" exact>
         <LoginPage/>
       </Route>
       
       <Route path="/login" exact> 
          <LoginPage />
        </Route>

       <Route path="/events" exact>
         <EventPage/>
       </Route>

       <Route path="/eventdetails" exact>
         <EventDetailsPage/>
       </Route>
       
       <Route path = "/register" exact>
          <RegisterPage/>
       </Route>
       
       <Route path = "/createevent" exact>
        <CreateEventPage/>
       </Route>

       <Route path = "/myevents" exact>
        <MyEventPage/>
       </Route>

       <Route path = "/updateevent" exact>
        <UpdateEventPage/>
       </Route>
       
       <Redirect to="/" />
     </Switch>
   </Router>
     );
}


export default App;
