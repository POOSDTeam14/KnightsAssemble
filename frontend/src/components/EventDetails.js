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
    const [messages, setMessages] = useState([]); // Initialize as an empty array

    const token = retrieveToken();
    const eventId = retrieveEventID();

    useEffect(() => {
        const fetchEventDetails = async () => {
            const obj = {
                eventid: eventId,
                token: token
            };
            const js = JSON.stringify(obj);

            try {
                const response = await fetch(buildPath('api/provideEventInfo'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });

                const res = await response.json();

                if (res.ret && res.ret.error) {
                    console.error('Error fetching event details:', res.ret.error);
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

        const fetchEventMessages = async () => {
            const obj = {
                eventid: eventId,
                token: token
            };
            const js = JSON.stringify(obj);

            try {
                const response = await fetch(buildPath('api/getEventMessages'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });

                const res = await response.json();

                if (res.ret && res.ret.error) {
                    console.error('Error fetching event messages:', res.ret.error);
                } else {
                    setMessages(res.ret);
                }
            } catch (error) {
                console.error('Failed to fetch event messages', error);
            }
        };

        fetchEventDetails();
        fetchEventMessages();
    }, [eventId, token]);

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter' && newMessage.trim()) {
            const obj = {
                eventid: eventId,
                token: token,
                text: newMessage
            };
            const js = JSON.stringify(obj);

            try {
                const response = await fetch(buildPath('api/postMessage'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });

                const res = await response.json();

                if (res.ret && res.ret.error) {
                    console.error('Error sending message:', res.ret.error);
                } else {
                    setMessages([...messages, { text: newMessage }]);
                    setNewMessage('');
                }
            } catch (error) {
                console.error('Failed to send message', error);
            }
        }
    };

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
                            {messages.map((message) => (
                                <p key={message._id}><strong>{message.Text}</strong></p>
                            ))}
                        </div>
                        <input
                            type="text"
                            id="newMessage"
                            className="form-control"
                            placeholder="Chat"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;