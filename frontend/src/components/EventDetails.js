import React, { useEffect, useState } from 'react';
import { buildPath } from './Path';
import { retrieveToken, retrieveEventID } from '../storage';

function EventDetails() {
    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEventDetails = async () => {
            const token = retrieveToken();
            const eventId = retrieveEventID();

            const obj = {
                eventid: eventId,
                token: token
            };
            const js = JSON.stringify(obj);

            try {
                const response = await fetch(buildPath(`api/provideEventInfo`), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });

                const res = await response.json();

                if ('error' in res.ret) {
                    setMessage(res.ret.error);
                } else {
                    setEventName(res.ret.Name);
                    setEventLocation(res.ret.Location);
                    setEventType(res.ret.Type);
                    setEventDate(new Date(res.ret.Time).toISOString().split('T')[0]);
                    setEventTime(new Date(res.ret.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    setDescription(res.ret.Description);
                }
            } catch (error) {
                console.error('Failed to fetch event details', error);
            }
        };

        fetchEventDetails();
    }, []);

    return (
        <div className="container">
            <div className="content">
                <div className="row">
                    <div className="col-md-8">
                        <h1>{eventName}</h1>
                        <p><strong>Event Type:</strong> {eventType}</p>
                        <p><strong>Date:</strong> {eventDate}</p>
                        <p><strong>Time:</strong> {eventTime}</p>
                        <p><strong>Location:</strong> {eventLocation}</p>
                        <p><strong>Description:</strong> {description}</p>
                    </div>
                    <div className="col-md-4">
                        <div className="chat-box">
                            <p><strong>Person1:</strong> I can't wait for this event!!!</p>
                            <p><strong>Person2:</strong> Who's bringing the drinks?</p>
                            <p><strong>Person3:</strong> I can bring the drinks if you want?</p>
                            <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                            <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                            <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                            <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                            <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                            <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                            <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                        </div>
                        <input type="text" id="newMessage" class="form-control" placeholder="Chat"></input>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;