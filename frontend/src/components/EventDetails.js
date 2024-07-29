import React, { useEffect, useState, useRef } from 'react';
import { buildPath } from './Path';
import { jwtDecode } from "jwt-decode";
import { retrieveToken, retrieveEventID } from '../storage';

function EventDetails() {
    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [description, setDescription] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isUserHost, setIsUserHost] = useState(false);
    const [isUserJoined, setIsUserJoined] = useState(false);
    const chatBoxRef = useRef(null);

    const token = retrieveToken();
    const eventId = retrieveEventID();
    const userId = jwtDecode(token).userInfo.userid;
    const messageSender = new Set();

    const fetchEventMessages = async () => {
        const obj = { eventid: eventId, token: token };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/getEventMessages'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if ('error' in res) {
                console.error('Error fetching event messages:', res.ret.error);
            } else {
                setMessages(res.ret);
                for(let i = 0; i < res.ret.length; ++i)
                {
                    fetchSenderNames(res.ret.userid);
                }
            }
        } catch (error) {
            console.error('Failed to fetch event messages', error);
        }
    };

    const fetchEventDetails = async () => {
        const obj = { eventid: eventId, token: token };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/provideEventInfo'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if ('error' in res) {
                console.error('Error fetching event details:', res.ret.error);
            } else {
                setEventName(res.ret.Name);
                setEventLocation(res.ret.Location);
                setEventType(res.ret.Type);
                setEventDate(new Date(res.ret.Time).toISOString().split('T')[0]);
                setEventTime(new Date(res.ret.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                setDescription(res.ret.Description);
                if (userId === res.ret.HostID) {
                    setIsUserHost(true);
                }
                let attendees = res.ret.Attendees;
                for (let i = 0; i < attendees.length; ++i) {
                    if (userId === attendees[i]) {
                        setIsUserJoined(true);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch event details', error);
        }
    };

    const fetchSenderNames = async (userId) => 
    {
        const obj = { userid: userId, token: token };
        const js = JSON.stringify(obj);

        try 
        {
            const response = await fetch(buildPath('api/findNames'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if (!('error' in res)) 
            {
                messageSender.add(res.ret.first + " " + res.ret.last + ": ");
            } 
        }
        catch (error) 
        {
            console.error('Failed to fetch message sender', error);
        }
    }

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter' && newMessage.trim()) {
            const obj = { eventid: eventId, userid: userId, message: newMessage, token: token };
            const js = JSON.stringify(obj);

            try {
                const response = await fetch(buildPath('api/postMessage'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });

                const res = await response.json();

                if ('error' in res) {
                    console.error('Error sending message:', res.ret.error);
                } else {
                    fetchEventMessages();
                    setNewMessage('');
                }
            } catch (error) {
                console.error('Failed to send message', error);
            }
        }
    };

    const handleJoinEvent = async () => {
        const obj = { eventid: eventId, userid: userId, token: token };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/joinEvent'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if ('error' in res) {
                console.error('Error joining event:', res.ret.error);
            } else {
                setIsUserJoined(true);
                fetchEventMessages();
            }
        } catch (error) {
            console.error('Failed to join event', error);
        }
    };

    const handleLeaveEvent = async () => {
        const obj = { eventid: eventId, userid: userId, token: token };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/leaveEvent'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if ('error' in res) {
                console.error('Error leaving event:', res.ret.error);
            } else {
                setIsUserJoined(false);
            }
        } catch (error) {
            console.error('Failed to leave event', error);
        }
    };

    useEffect(() => {
        fetchEventDetails();
        fetchEventMessages();
    }, [eventId, token]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleUpdateEvent = async () => {
        window.location.href = '/updateevent';
    };

    return (
        <div className="container my-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-8 col-md-7 mb-4">
                            <h1 className="card-title">{eventName}</h1>
                            <p><strong>Event Type:</strong> {eventType}</p>
                            <p><strong>Date:</strong> {eventDate}</p>
                            <p><strong>Time:</strong> {eventTime}</p>
                            <p><strong>Location:</strong> {eventLocation}</p>
                            <p><strong>Description:</strong></p>
                            <p>{description}</p>
                        </div>
                        <div className="col-lg-4 col-md-5">
                            {isUserHost ? (
                                <>
                                    <div className="chat-box border rounded p-3 mb-3" ref={chatBoxRef}>
                                        {messages.map((message) => (
                                            <p key={message._id}>
                                                <strong>{messageSender[message.User] || 'Unknown'}: </strong> {message.Text}
                                            </p>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        id="newMessage"
                                        className="form-control"
                                        placeholder="Type a message and press Enter"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <button className="btn btn-warning mt-2 w-100" onClick={handleUpdateEvent}>
                                        Update event
                                    </button>
                                </>
                            ) : (
                                <>
                                    {isUserJoined ? (
                                        <>
                                            <div className="chat-box border rounded p-3 mb-3" ref={chatBoxRef}>
                                                {messages.map((message) => (
                                                    <p key={message._id}>
                                                        <strong>{messageSender[message.User] || 'Unknown'}: </strong> {message.Text}
                                                    </p>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                id="newMessage"
                                                className="form-control"
                                                placeholder="Type a message and press Enter"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                            />
                                            <button className="btn btn-danger mt-2 w-100" onClick={handleLeaveEvent}>
                                                Leave event
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn btn-primary mt-2 w-100" onClick={handleJoinEvent}>
                                            Join event
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;