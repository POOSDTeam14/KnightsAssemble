import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
const { retrieveToken } = require('../storage.js');

function CreateEvent(){

    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventCapacity, setEventCapacity] = useState('');
    const [description, setDescription] = useState('');

    const [message,setMessage] = useState('');

    let bp = require('./Path.js');

    const doCreateEvent = async event => 
        {
            event.preventDefault();
            setMessage("");
            //Validate All Inputs Filled
            if (!eventName || !eventLocation || !eventType || !eventDate || !eventTime || !eventCapacity || !description) {
                setMessage('All fields must be filled out!');
                return;
            }
            
            //Pass Date Object
            const dateObject = new Date(`${eventDate}T${eventTime}`);

            let testCapacity = parseInt(eventCapacity);
            let token = retrieveToken();
            let userId = jwtDecode(token).userInfo.userid;

            if(Number.isInteger(testCapacity)){
                var obj = {
                name: eventName,
                type: eventType,
                description: description,
                location: eventLocation,
                time: dateObject,
                capacity: testCapacity,
                hostid: userId,
                attendees: null,
                token: token
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
            }
            else{
                setMessage("Capacity must be an integer!");
            }
        };



    return(
        <div class="createEvent-container">
           
           <div className = "row g-0 createEvent-TopRow">
                
                <div className = "row g-0 createEvent-Header">
                    <h1>Create Event</h1>
                </div>

                <div className = "row g-0 createEvent-Image">
                    <img src ="https://i.imgur.com/zfs6dLN.png" alt = "UCF Pegasus Seal"/>
                </div>

           </div>

           <div className = 'row g-0 createEvent-BottomRow'>

                <div className = "row g-0 createEvent-InfoRow ">
                    
                    <div className = "col createEvent-Col1 h-100">

                        <div className = "row g-0 createEvent-NameRow">
                            
                            <div className = "col createEvent-InfoTextInput">
                                <p>Event Name</p>
                                <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)}/>
                            </div>

                        </div>

                        <div className = "row g-0 createEvent-LocationRow">

                            <div className = "col createEvent-InfoTextInput">
                                <p>Location</p>
                                <input type="text" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)}/>
                            </div>

                        </div>

                        <div className = "row g-0 createEvent-TypeRow">

                            <div className = "col createEvent-InfoTextInput">
                                <label htmlFor="event-type" className="visually-hidden">Event Type</label>
                                <p>Event Type</p>
                                <select id="event-type" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                                    <option value = "" disabled selected>Event Type</option>
                                    <option value = "Sports">Sports</option>
                                    <option value = "Food">Food</option>
                                    <option value = "Clubs">Clubs</option>
                                    <option value = "Academic">Academic</option>
                                    <option value = "Entertainment">Entertainment</option>
                                    <option value = "Volunteer">Volunteer</option>
                                </select>
                            </div>

                        </div>

                    </div>

                    <div className = "col createEvent-Col2 h-100">
                        <div className = "row g-0 createEvent-DateRow">
                                
                            <div className = "col createEvent-InfoTextInput">
                                <label htmlFor="event-date" className="visually-hidden">Event Date</label>
                                <p>Event Date</p>
                                <input id="event-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                            </div>

                        </div>

                        <div className = "row g-0 createEvent-TimeRow">
    
                            <div className = "col createEvent-InfoTextInput">
                                <label htmlFor="event-StartTime" className="visually-hidden">Event Start Time</label>
                                <p>Start Time</p>
                                <select id="event-StartTime" value={eventTime} onChange={(e) => setEventTime(e.target.value)}>
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
  
                        </div>
                    
                        <div className = "row g-0 createEvent-CapacityRow">
                            
                            <div className = "col createEvent-InfoTextInput">
                                <p>Event Capacity</p>
                                <input type="text" placeholder="Capacity" value={eventCapacity} onChange={(e) => setEventCapacity(e.target.value)}/>
                            </div>
                        </div>
                   
                    </div>

                    <div className = "col createEvent-Col3 h-100">

                            <div className = "row g-0 createEvent-DescriptionRow">
                                
                                <div className = "col createEvent-InfoTextInput">
                                    <p>Event Description</p>
                                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                                </div>
    
                            </div>
                    </div>
                </div>

                <div className = "row g-0 createEvent-ButtonRow">
                    <button id = "createEvent-Button" onClick={doCreateEvent}>Create Event</button>
                    <span id="createEventResult">{message}</span>
                </div>
  
           </div>
        </div>
    );
}

export default CreateEvent;