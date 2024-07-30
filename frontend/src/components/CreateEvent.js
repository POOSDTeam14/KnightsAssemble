import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
const { retrieveToken } = require('../storage.js');

function CreateEvent() {

    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventCapacity, setEventCapacity] = useState('');
    const [description, setDescription] = useState('');

    const [message, setMessage] = useState('');

    let bp = require('./Path.js');

    const doCreateEvent = async event => {
        event.preventDefault();
        setMessage("");

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
                hostid: userId,
                attendees: null,
                token: token
            };
            let js = JSON.stringify(obj);

            try {
                const response = await fetch(bp.buildPath('api/createEvent'), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

                let res = JSON.parse(await response.text());

                if ('error' in res) {
                    setMessage(res.error);
                } else {
                    setMessage('');
                    window.location.href = '/events';
                }
            } catch (e) {
                alert(e.toString());
                return;
            }
        } else {
            setMessage("Capacity must be an integer.");
        }
    };

    return (
        <div className="createEvent-container">
            <div className="createEvent-TopRow">
                <div className="createEvent-Header">
                    <h1>Create event</h1>
                </div>
                <div className="createEvent-Image">
                    <img src="https://i.imgur.com/zfs6dLN.png" alt="UCF Pegasus Seal" />
                </div>
            </div>
            <div className='createEvent-BottomRow'>
                <div className="createEvent-InfoRow">
                    <div className="createEvent-Col1">
                        <div className="createEvent-InfoTextInput">
                            <p>Event name</p>
                            <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                        </div>
                        <div className="createEvent-InfoTextInput">
                            <p>Location</p>
                            <input type="text" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                        </div>
                        <div className="createEvent-InfoTextInput">
                            <p>Event type</p>
                            <select id="event-type" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                                <option value="" disabled selected>Event Type</option>
                                <option value="Sports">Sports</option>
                                <option value="Food">Food</option>
                                <option value="Clubs">Clubs</option>
                                <option value="Academic">Academic</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Volunteer">Volunteer</option>
                            </select>
                        </div>
                    </div>
                    <div className="createEvent-Col2">
                        <div className="createEvent-InfoTextInput">
                            <p>Event date</p>
                            <input id="event-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                        </div>
                        <div className="createEvent-InfoTextInput">
                            <p>Start time</p>
                            <input id="event-StartTime" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                        </div>
                        <div className="createEvent-InfoTextInput">
                            <p>Event capacity</p>
                            <input type="text" placeholder="Capacity" value={eventCapacity} onChange={(e) => setEventCapacity(e.target.value)} />
                        </div>
                    </div>
                    <div className="createEvent-Col3">
                        <div className="createEvent-InfoTextInput">
                            <p>Event description</p>
                            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="createEvent-ButtonRow">
                    <button id="createEvent-Button" onClick={doCreateEvent}>Create Event</button>
                    <span id="createEventResult">{message}</span>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;