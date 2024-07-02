import React, { useState } from 'react'

function CreateEvent(){

    let eventName, eventLocation, eventType;
    let eventMonth = "", eventDate = "", eventYear = "";
    let eventDescription;
    let eventTime = "";
    let eventCapacity;
    let eventAttendees = "";

    const [message,setMessage] = useState('');

    let bp = require('./Path.js');

    const doCreateEvent = async event => 
        {
            event.preventDefault();
            //Pass Date Object
            if(!eventMonth.value || !eventDate.value || !eventTime.value || !eventYear.value){
                setMessage("All fields must be filled out!")
                return;
            }
            let dateObject = `${eventMonth.value} ${eventDate.value}, ${eventYear.value} ${eventTime.value}`;

            var obj = {
              name: eventName.value,
              type: eventType.value,
              description: eventDescription.value,
              location: eventLocation.value,
              time: dateObject,
              capacity: eventCapacity.value,
              attendees: (eventAttendees.value).split(",").map(name => name.trim())
            };
            let js = JSON.stringify(obj);
    
            try
            {    
              const response = await fetch(bp.buildPath('api/createEvent'), 
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
  
    
                let res = JSON.parse(await response.text());
    
                if('error' in res)
                {
                    setMessage(res.error);
                }
                else
                {                 
                    setMessage('');
                    window.location.href = '/events';
                }
            }
            catch(e)
            {
                alert(e.toString());
                return;
            }    
        };



    return(
        <div class="page-container">
        <div class="tab-column">
            <a href="/events">
                <p>Events</p>
            </a><br/>
            <a href="#">
                <p>My Events</p>
            </a>
        </div>
        <div class="createEvent-container">
            <h1>Create Event</h1>
          <img src ="https://i.imgur.com/zfs6dLN.png" alt = "UCF Pegasus Seal"/>
            <div class="createEvent-info-1">
                <div class="eventInput-container">
                    <p>Event Name</p>
                    <input type="text" placeholder="Event Name" ref = {(elem) => eventName = elem}/>
                    <p>Description</p>
                    <textarea placeholder = "Event Description" ref = {(elem) => eventDescription = elem}></textarea>
                </div>
                <div class="eventInput-container">
                    <p>Location</p>
                    <input type="text" placeholder="Location" ref = {(elem) => eventLocation = elem}/>
                   <p>Attendees</p>
                    <textarea placeholder = "Enter Attendees Names Seperated by Commas " ref = {(elem) => eventAttendees = elem}></textarea>
                </div>
                <div class="eventInput-container">
                    <p>Event Type</p>
                    <select ref = {(elem) => eventType = elem}>
                        <option value = "" disabled selected>Event Type</option>
                        <option value = "Sports">Sports</option>
                        <option value = "Food">Food</option>
                        <option value = "Clubs">Clubs</option>
                        <option value = "Study">Study</option>
                        <option value = "Entertainment">Entertainment</option>
                        <option value = "Volunteer">Volunteer</option>
                    </select>
                </div>
            </div>
            <div class="createEvent-info-2">
                <div class="eventInput-container date-container">
                    <p>Event Date</p>
                    <select ref = {(elem) => eventMonth = elem}>
                        <option value = "" disabled selected>Month</option>
                        <option value = "January">January</option>
                        <option value = "Feburary">Feburary</option>
                        <option value = "March">March</option>
                        <option value = "April">April</option>
                        <option value = "May">May</option>
                        <option value = "June">June</option>
                        <option value = "July">July</option>
                        <option value = "August">August</option>
                        <option value = "September">September</option>
                        <option value = "October">October</option>
                        <option value = "November">November</option>
                        <option value = "December">December</option>
                    </select>
                    <input type="text" placeholder="Date" ref = {(elem) => eventDate = elem}/>
                    <input type="text" placeholder="Year"ref = {(elem) => eventYear = elem}/>
                </div>
                <div class="eventInput-container">
                    <p>Start Time</p>
                    <select ref = {(elem) => eventTime = elem}>
                        <option value = "" disabled selected>Start Time</option>
                        <option value = "00:00">12:00 am</option>
                        <option value = "00:30">12:30 am</option>
                        <option value = "01:00">1:00 am</option>
                        <option value = "01:30">1:30 am</option>
                        <option value = "02:00">2:00 am</option>
                        <option value = "02:30">2:30 am</option>
                        <option value = "03:00">3:00 am</option>
                        <option value = "03:30">3:30 am</option>
                        <option value = "04:00">4:00 am</option>
                        <option value = "04:30">4:30 am</option>
                        <option value = "05:00">5:00 am</option>
                        <option value = "05:30">5:30 am</option>
                        <option value = "06:00">6:00 am</option>
                        <option value = "06:30">6:30 am</option>
                        <option value = "07:00">7:00 am</option>
                        <option value = "07:30">7:30 am</option>
                        <option value = "08:00">8:00 am</option>
                        <option value = "08:30">8:30 am</option>
                        <option value = "09:00">9:00 am</option>
                        <option value = "09:30">9:30 am</option>
                        <option value = "10:00">10:00 am</option>
                        <option value = "10:30">10:30 am</option>
                        <option value = "11:00">11:00 am</option>
                        <option value = "11:30">11:30 am</option>
                        <option value = "12:00">12:00 pm</option>
                        <option value = "12:30">12:30 pm</option>
                        <option value = "13:00">1:00 pm</option>
                        <option value = "13:30">1:30 pm</option>
                        <option value = "14:00">2:00 pm</option>
                        <option value = "14:30">2:30 pm</option>
                        <option value = "15:00">3:00 pm</option>
                        <option value = "15:30">3:30 pm</option>
                        <option value = "16:00">4:00 pm</option>
                        <option value = "16:30">4:30 pm</option>
                        <option value = "17:00">5:00 pm</option>
                        <option value = "17:30">5:30 pm</option>
                        <option value = "18:00">6:00 pm</option>
                        <option value = "18:30">6:30 pm</option>
                        <option value = "19:00">7:00 pm</option>
                        <option value = "19:30">7:30 pm</option>
                        <option value = "20:00">8:00 pm</option>
                        <option value = "20:30">8:30 pm</option>
                        <option value = "21:00">9:00 pm</option>
                        <option value = "21:30">9:30 pm</option>
                        <option value = "22:00">10:00 pm</option>
                        <option value = "22:30">10:30 pm</option>
                        <option value = "23:00">11:00 pm</option>
                        <option value = "23:30">11:30 pm</option>
                    </select>
                </div>
                <div class="eventInput-container">
                    <p>Event Capacity</p>
                    <input type="text" placeholder="Capacity" ref = {(elem) => eventCapacity = elem}/>
                </div>
            </div>
               <button id = "createEvent-Button" onClick={doCreateEvent}>Create Event</button>
               <span id="createEventResult">{message}</span>
        </div>
   
    </div>
    );
}

export default CreateEvent;