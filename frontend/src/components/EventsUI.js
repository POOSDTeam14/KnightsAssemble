import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
const { retrieveToken, storeEventID } = require('../storage.js');

function EventsUI()
{   
    const [eventType, setEventType] = useState("");

    let token = retrieveToken();
    let userId = jwtDecode(token).userInfo.userid;

    return(
        <div className = "mainEventsPage-container">

            <div className = "row g-0 eventSearchRow">
                
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value = "" disabled selected>Event Type</option>
                    <option value = "Sports">Sports</option>
                    <option value = "Food">Food</option>
                    <option value = "Clubs">Clubs</option>
                    <option value = "Academic">Academic</option>
                    <option value = "Entertainment">Entertainment</option>
                    <option value = "Volunteer">Volunteer</option>
                </select>

                <input type = "text" placeholder="Search"></input>

                <button>Search</button>


            </div>

            <div className = "row g-0 mainEventsDisplay">

            </div>

        </div>
    );
}

export default EventsUI;
