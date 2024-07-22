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
          setEventDate(new Date(res.ret.Time).toISOString().split('T')[0]);
          setEventTime(new Date(res.ret.Time).toTimeString().split(' ')[0].substring(0, 5));
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
      setMessage('All fields must be filled out!');
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
      setMessage('Capacity must be an integer!');
    }
  };

  return (
    <div className="createEvent-container">
      <div className="row g-0 createEvent-TopRow">
        <div className="row g-0 createEvent-Header">
          <h1>Update Event</h1>
        </div>
        <div className="row g-0 createEvent-Image">
          <img src="https://i.imgur.com/zfs6dLN.png" alt="UCF Pegasus Seal" />
        </div>
      </div>

      <div className="row g-0 createEvent-BottomRow">
        <div className="row g-0 createEvent-InfoRow ">
          <div className="col createEvent-Col1 h-100">
            <div className="row g-0 createEvent-NameRow">
              <div className="col createEvent-InfoTextInput">
                <p>Event Name</p>
                <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
              </div>
            </div>

            <div className="row g-0 createEvent-LocationRow">
              <div className="col createEvent-InfoTextInput">
                <p>Location</p>
                <input type="text" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
              </div>
            </div>

            <div className="row g-0 createEvent-TypeRow">
              <div className="col createEvent-InfoTextInput">
                <p>Event Type</p>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                  <option value="" disabled selected>
                    Event Type
                  </option>
                  <option value="Sports">Sports</option>
                  <option value="Food">Food</option>
                  <option value="Clubs">Clubs</option>
                  <option value="Academic">Academic</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col createEvent-Col2 h-100">
            <div className="row g-0 createEvent-DateRow">
              <div className="col createEvent-InfoTextInput">
                <p>Event Date</p>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </div>
            </div>

            <div className="row g-0 createEvent-TimeRow">
              <div className="col createEvent-InfoTextInput">
                <p>Start Time</p>
                <select value={eventTime} onChange={(e) => setEventTime(e.target.value)}>
                  <option value="" disabled selected>
                    Start Time
                  </option>
                  <option value="00:00">12:00 am</option>
                  <option value="00:30">12:30 am</option>
                  <option value="01:00">1:00 am</option>
                  <option value="01:30">1:30 am</option>
                  <option value="02:00">2:00 am</option>
                  <option value="02:30">2:30 am</option>
                  <option value="03:00">3:00 am</option>
                  <option value="03:30">3:30 am</option>
                  <option value="04:00">4:00 am</option>
                  <option value="04:30">4:30 am</option>
                  <option value="05:00">5:00 am</option>
                  <option value="05:30">5:30 am</option>
                  <option value="06:00">6:00 am</option>
                  <option value="06:30">6:30 am</option>
                  <option value="07:00">7:00 am</option>
                  <option value="07:30">7:30 am</option>
                  <option value="08:00">8:00 am</option>
                  <option value="08:30">8:30 am</option>
                  <option value="09:00">9:00 am</option>
                  <option value="09:30">9:30 am</option>
                  <option value="10:00">10:00 am</option>
                  <option value="10:30">10:30 am</option>
                  <option value="11:00">11:00 am</option>
                  <option value="11:30">11:30 am</option>
                  <option value="12:00">12:00 pm</option>
                  <option value="12:30">12:30 pm</option>
                  <option value="13:00">1:00 pm</option>
                  <option value="13:30">1:30 pm</option>
                  <option value="14:00">2:00 pm</option>
                  <option value="14:30">2:30 pm</option>
                  <option value="15:00">3:00 pm</option>
                  <option value="15:30">3:30 pm</option>
                  <option value="16:00">4:00 pm</option>
                  <option value="16:30">4:30 pm</option>
                  <option value="17:00">5:00 pm</option>
                  <option value="17:30">5:30 pm</option>
                  <option value="18:00">6:00 pm</option>
                  <option value="18:30">6:30 pm</option>
                  <option value="19:00">7:00 pm</option>
                  <option value="19:30">7:30 pm</option>
                  <option value="20:00">8:00 pm</option>
                  <option value="20:30">8:30 pm</option>
                  <option value="21:00">9:00 pm</option>
                  <option value="21:30">9:30 pm</option>
                  <option value="22:00">10:00 pm</option>
                  <option value="22:30">10:30 pm</option>
                  <option value="23:00">11:00 pm</option>
                  <option value="23:30">11:30 pm</option>
                </select>
              </div>
            </div>

            <div className="row g-0 createEvent-CapacityRow">
              <div className="col createEvent-InfoTextInput">
                <p>Event Capacity</p>
                <input type="text" placeholder="Capacity" value={eventCapacity} onChange={(e) => setEventCapacity(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col createEvent-Col3 h-100">
            <div className="row g-0 createEvent-DescriptionRow">
              <div className="col createEvent-InfoTextInput">
                <p>Event Description</p>
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-0 createEvent-ButtonRow">
          <button id="createEvent-Button" onClick={doUpdateEvent}>
            Update Event
          </button>
          <span id="createEventResult">{message}</span>
        </div>
      </div>
    </div>
  );
}

export default UpdateEvent;
