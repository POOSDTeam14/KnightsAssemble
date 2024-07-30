import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { buildPath } from './Path';
import { jwtDecode } from "jwt-decode";
import { retrieveToken, retrieveEventID } from '../storage';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function EventDetails() {
    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [numberOfAttendees, setNumberOfAttendees] = useState(0); 
    const [capacity, setCapacity] = useState(0); 
    const [description, setDescription] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isUserHost, setIsUserHost] = useState(false);
    const [isUserJoined, setIsUserJoined] = useState(false);
    const [messageSender, setMessageSender] = useState(new Map());
    const chatBoxRef = useRef(null);

    const [eventCoordinates, setEventCoordinates] = useState(null);

    const token = retrieveToken();
    const eventId = retrieveEventID();
    const userId = jwtDecode(token).userInfo.userid;

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
                const messages = res.ret;
                setMessages(messages);

                const fetchSenderPromises = messages.map(message => fetchSenderNames(message.User));
                await Promise.all(fetchSenderPromises);
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
                setNumberOfAttendees((res.ret.Attendees).length); 
                setCapacity(res.ret.Capacity); 
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

            const locationResponse = await fetch(buildPath('api/markLocation'), {
                method: 'POST',
                body: JSON.stringify({ location: res.ret.Location, token: token }),
                headers: { 'Content-Type': 'application/json' }
            });
    
            const locationRes = await locationResponse.json();
            if ('error' in locationRes) {
                console.error('Error fetching location coordinates:', locationRes.error);
            } else {
                setEventCoordinates({ lat: locationRes.ret.lat, long: locationRes.ret.long });
            }
            
        } catch (error) {
            console.error('Failed to fetch event details', error);
        }
        

    };

    const fetchSenderNames = async (userId) => {
        const obj = { userid: userId, token: token };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/findNames'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if (!('error' in res)) {
                setMessageSender(prevState => new Map(prevState).set(userId, res.ret.first + " " + res.ret.last));
            }
        } catch (error) {
            console.error('Failed to fetch message sender', error);
        }
    };

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
                            {eventCoordinates && (
                                <MapContainer
                                    center={[eventCoordinates.lat, eventCoordinates.long]}
                                    zoom={15}
                                    style={{ height: '400px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[eventCoordinates.lat, eventCoordinates.long]}>
                                        <Popup>
                                            {eventName} <br /> {eventLocation}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                            <p><strong>Capacity: </strong> {numberOfAttendees}/{capacity}</p>
                            <p><strong>Description:</strong></p>
                            <p>{description}</p>
                        </div>
                        <div className="col-lg-4 col-md-5">
                            {isUserHost ? (
                                <>
                                    <div className="chat-box border rounded p-3 mb-3" ref={chatBoxRef}>
                                        {messages.map((message) => (
                                            <p key={message._id}>
                                                <strong>{messageSender.get(message.User) || 'Unknown'}: </strong> {message.Text} <br/> {message.TimeSent}
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
                                                        <strong>{messageSender.get(message.User) || 'Unknown'}: </strong> {message.Text} <br /> {message.TimeSent}
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
                                        <button className="btn btn-primary w-100" onClick={handleJoinEvent}>
                                            Join Event
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