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

    const doCreateEvent = async (event) => {
        event.preventDefault();
        setMessage("");

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
                hostid: userId,
                attendees: null,
                token: token
            };
            let js = JSON.stringify(obj);

            try {
                const response = await fetch(bp.buildPath('api/createEvent'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });

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
            setMessage("Capacity must be an integer!");
        }
    };

    return (
        <div className="createEvent-container">
            <div className="row g-0 createEvent-TopRow">
                <div className="row g-0 createEvent-Header">
                    <h1>Create event</h1>
                </div>
                <div className="row g-0 createEvent-Image">
                    <img src="https://i.imgur.com/zfs6dLN.png" alt="UCF Pegasus Seal" />
                </div>
            </div>

            <div className="row g-0 createEvent-BottomRow">
                <div className="row g-0 createEvent-InfoRow">
                    <div className="col createEvent-Col1 h-100">
                        <div className="row g-0 createEvent-NameRow">
                            <div className="col createEvent-InfoTextInput">
                                <p>Event name</p>
                                <input
                                    type="text"
                                    placeholder="Event Name"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row g-0 createEvent-LocationRow">
                            <div className="col createEvent-InfoTextInput">
                                <p>Location</p>
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={eventLocation}
                                    onChange={(e) => setEventLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row g-0 createEvent-TypeRow">
                            <div className="col createEvent-InfoTextInput">
                                <label htmlFor="event-type" className="visually-hidden">Event Type</label>
                                <p>Event type</p>
                                <select
                                    id="event-type"
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value)}
                                >
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
                    </div>

                    <div className="col createEvent-Col2 h-100">
                        <div className="row g-0 createEvent-DateRow">
                            <div className="col createEvent-InfoTextInput">
                                <label htmlFor="event-date" className="visually-hidden">Event Date</label>
                                <p>Event date</p>
                                <input
                                    id="event-date"
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row g-0 createEvent-TimeRow">
                            <div className="col createEvent-InfoTextInput">
                                <label htmlFor="event-time" className="visually-hidden">Event Start Time</label>
                                <p>Start time</p>
                                <input
                                    id="event-time"
                                    type="time"
                                    value={eventTime}
                                    onChange={(e) => setEventTime(e.target.value)}
                                    step="60"
                                />
                            </div>
                        </div>
                        <div className="row g-0 createEvent-CapacityRow">
                            <div className="col createEvent-InfoTextInput">
                                <p>Event capacity</p>
                                <input
                                    type="text"
                                    placeholder="Capacity"
                                    value={eventCapacity}
                                    onChange={(e) => setEventCapacity(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col createEvent-Col3 h-100">
                        <div className="row g-0 createEvent-DescriptionRow">
                            <div className="col createEvent-InfoTextInput">
                                <p>Event description</p>
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-0 createEvent-ButtonRow">
                    <button id="createEvent-Button" onClick={doCreateEvent}>Create Event</button>
                    <span id="createEventResult">{message}</span>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;