import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
const { retrieveToken, retrieveEventID } = require('../storage.js');

function UpdateEvent() {
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventCapacity, setEventCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  let bp = require('./Path.js');

  let token = retrieveToken();
  let eventId = retrieveEventID();

  useEffect(() => {
    const fetchEventDetails = async () => {
      
      var obj = {
        eventid: eventId,
        token: token
      };
      let js = JSON.stringify(obj);
      
      
      try {
        const response = await fetch(bp.buildPath(`api/provideEventInfo`), {
          method: 'POST',
          body: js,
          headers: { 'Content-Type': 'application/json' }
        });
        
        let res = await JSON.parse(await response.text());

        if ('error' in res.ret) {
          setMessage(res.ret.error);
        } else {
          setEventName(res.ret.Name);
          setEventLocation(res.ret.Location);
          
          setEventType(res.ret.Type);
          const { formattedDate, formattedTime } = convertUTCtoEST(res.ret.Time);
          setEventDate(formattedDate);
          setEventTime(formattedTime);
          
          setEventCapacity(res.ret.Capacity);
          setDescription(res.ret.Description);
          setMessage('');
      }

      } catch (error) {
        console.error('Failed to fetch event details', error);
      }
    };
    fetchEventDetails();
  }, []);

  const doUpdateEvent = async event => {
    event.preventDefault();
    setMessage('');
    if (!eventName || !eventLocation || !eventType || !eventDate || !eventTime || !eventCapacity || !description) {
      setMessage('All fields must be filled out.');
      return;
    }

    const dateObject = new Date(`${eventDate}T${eventTime}`);
    let testCapacity = parseInt(eventCapacity);
    let token = retrieveToken();
    let userId = jwtDecode(token).userInfo.userid;

    if (Number.isInteger(testCapacity)) {
      var obj = {
        name: eventName,
        type: eventType,
        description: description,
        location: eventLocation,
        time: dateObject,
        capacity: testCapacity,
        eventid: eventId,
        token: token,
      };
      let js = JSON.stringify(obj);

      try {
        const response = await fetch(bp.buildPath('api/updateEvent'), {
          method: 'POST',
          body: js,
          headers: { 'Content-Type': 'application/json' },
        });

        let res = JSON.parse(await response.text());

        if ('error' in res) {
          setMessage(res.error);
        } else {
          setMessage('');
          window.location.href = '/myevents';
        }
      } catch (e) {
        alert(e.toString());
        return;
      }
    } else {
      setMessage('Capacity must be an integer.');
    }
  };

  function convertUTCtoEST(utcDateString) {
    const date = new Date(utcDateString);
    const utcOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const estOffset = -5 * 60 * 60000; // EST offset is UTC-5
  
    // Check if the date is during daylight saving time (DST) in EST (typically March to November)
    const isDST = () => {
      const year = date.getFullYear();
      // DST starts on the second Sunday in March (month 2) and ends on the first Sunday in November (month 10)
      const dstStart = new Date(year, 2, 8 + 7 - new Date(year, 2, 8).getDay());
      const dstEnd = new Date(year, 10, 1 + 7 - new Date(year, 10, 1).getDay());
      return date.getTime() >= dstStart.getTime() && date.getTime() < dstEnd.getTime();
    };
  
    // Adjust EST offset to account for DST
    const adjustedEstOffset = isDST() ? -4 * 60 * 60000 : estOffset;
  
    const estTime = new Date(date.getTime() + utcOffset + adjustedEstOffset);
  
    // Format date as YYYY-MM-DD and time as HH:MM
    const year = estTime.getFullYear();
    const month = String(estTime.getMonth() + 1).padStart(2, '0'); 
    const day = String(estTime.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`
  
    const hours = String(estTime.getHours()).padStart(2, '0');
    const minutes = String(estTime.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
  
    return { formattedDate, formattedTime };
  }

  return (
    <div className="createEvent-container">
      <div className="createEvent-header">
        <h1>Create event</h1>
      </div>

      <div className="createEvent-form">
        <div className="createEvent-inputGroup">
          <label>Name</label>
          <input
            type="text"
            placeholder="Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        <div className="createEvent-inputGroup">
          <label>Location</label>
          <input
            type="text"
            placeholder="Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
        </div>

        <div className="createEvent-inputGroup">
          <label>Type</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="" disabled selected>Type</option>
            <option value="Sports">Sports</option>
            <option value="Food">Food</option>
            <option value="Clubs">Clubs</option>
            <option value="Academic">Academic</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Volunteer">Volunteer</option>
          </select>
        </div>

        <div className="createEvent-inputGroup">
          <label>Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        <div className="createEvent-inputGroup">
          <label>Start time</label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </div>

        <div className="createEvent-inputGroup">
          <label>Capacity</label>
          <input
            type="text"
            placeholder="Capacity"
            value={eventCapacity}
            onChange={(e) => setEventCapacity(e.target.value)}
          />
        </div>

        <div className="createEvent-inputGroup">
          <label>Description</label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="createEvent-buttonGroup">
          <span>{message}</span>
          <button onClick={doCreateEvent}>Create event</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateEvent;
