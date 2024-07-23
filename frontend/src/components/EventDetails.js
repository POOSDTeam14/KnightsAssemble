import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
const { retrieveToken, retrieveEventID } = require('../storage.js');

function EventDetails()
{
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
                    setDescription(res.ret.Description);
                }

            } catch (error) {
                console.error('Failed to fetch event details', error);
            }
        };
        fetchEventDetails();
    }, []);

return (
    <div class="container">
        <div class="content">
            <div class="row">
                <div class="col-md-8">
                    <h1 innerHTML={eventName} onChange={(e) => setEventName(e.target.value)}>Event Name</h1>
                    <p innerHTML={eventType} onChange={(e) => setEventType(e.target.value)}><strong>Event Type:</strong> Type</p>
                    <p innerHTML={eventDate} onChange={(e) => setEventDate(e.target.value)}><strong>Date:</strong> mm/dd/yyyy</p>
                    <p innerHTML={eventTime} onChange={(e) => setEventTime(e.target.value)}><strong>Time:</strong> 00:00</p>
                    <p innerHTML={eventLocation} onChange={(e) => setEventLocation(e.target.value)}><strong>Location:</strong> location</p>
                    <p><strong>Description:</strong></p>
                    <p innerHTML={description} onChange={(e) => setDescription(e.target.value)}>Bello</p>
                </div>
                <div class="col-md-4">
                    <div class="chat-box">
                        <p><strong>Person1:</strong> I can't wait for this event!!!</p>
                        <p><strong>Person2:</strong> Who's bringing the drinks?</p>
                        <p><strong>Person3:</strong> I can bring the drinks if you want?</p>
                        <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                    </div>
                    <input type="text" id ="newMessage" placeholder="Chat"></input>
                </div>
            </div>
        </div>
    </div>
)
}

export default EventDetails;