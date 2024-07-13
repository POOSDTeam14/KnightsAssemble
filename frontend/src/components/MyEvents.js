import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import DeleteEventPopup from './DeleteEventPopup';
import LeaveEventPopup from './LeaveEventPopup';
const { retrieveToken } = require('../storage.js');

const eventTypeImages = {
    Sports: "https://i.imgur.com/SaiXbOK.png",
    Food: "https://i.imgur.com/4SfvabH.png",
    Clubs: "https://i.imgur.com/uWBwSuI.png",
    Academic: "https://i.imgur.com/XW4b06x.png",
    Entertainment: "https://i.imgur.com/ZsBFgO5.png",
    Volunteer: "https://i.imgur.com/yQ3ApTx.png"
}

function MyEvents() {
    const [message, setMessage] = useState('');
    const [hostedEvents, setHostedEvents] = useState([]);
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [currentHostedEventPage, setCurrentHostedEventPage] = useState(1);
    const [currentAttendedEventPage, setCurrentAttendedEventPage] = useState(1);
    const eventsPerPage = 3;

    const [showDeleteEventPopup, setDeleteEventPopup] = useState(false);
    const [showLeaveEventPopup, setLeaveEventPopup] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null); // State to hold the selected event ID

    let bp = require('./Path.js');

    const fetchHostEvents = async () => {
        let token = retrieveToken();
        let userId = jwtDecode(token).userInfo.userid;

        var obj = {
            userid: userId,
            token: token
        };
        let js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('api/findCreatedEvents'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            let res = JSON.parse(await response.text());

            if ('error' in res) {
                setMessage(res.error);
            } else {
                setHostedEvents(res.ret);
                setMessage('');
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    const fetchAttendedEvents = async () => {
        let token = retrieveToken();
        let userId = jwtDecode(token).userInfo.userid;

        var obj = {
            userid: userId,
            token: token
        };
        let js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('api/findJoinedEvents'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            let res = JSON.parse(await response.text());

            if ('error' in res) {
                setMessage(res.error);
            } else {
                setAttendedEvents(res.ret);
                setMessage('');
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    useEffect(() => {
        fetchHostEvents();
        fetchAttendedEvents();
    }, []);

    /************* Hosted Events Page ***************/
    const indexOfLastHostedEvent = currentHostedEventPage * eventsPerPage;
    const indexOfFirstHostedEvent = indexOfLastHostedEvent - eventsPerPage;
    const currentHostedEvents = hostedEvents.slice(indexOfFirstHostedEvent, indexOfLastHostedEvent);
    
    const nextHostedEventPage = () => {
        if (currentHostedEventPage < Math.ceil(hostedEvents.length / eventsPerPage)) {
            setCurrentHostedEventPage(currentHostedEventPage + 1);
        }
    };
    
    const prevHostedEventPage = () => {
        if (currentHostedEventPage > 1) {
            setCurrentHostedEventPage(currentHostedEventPage - 1);
        }
    };

    /************* Attended Events Page ***************/
    const indexOfLastAttendedEvent = currentAttendedEventPage * eventsPerPage;
    const indexOfFirstAttendedEvent = indexOfLastAttendedEvent - eventsPerPage;
    const currentAttendedEvents = attendedEvents.slice(indexOfFirstAttendedEvent, indexOfLastAttendedEvent);
    
    const nextAttendedEventPage = () => {
        if (currentAttendedEventPage < Math.ceil(attendedEvents.length / eventsPerPage)) {
            setCurrentAttendedEventPage(currentAttendedEventPage + 1);
        }
    };
    
    const prevAttendedEventPage = () => {
        if (currentAttendedEventPage > 1) {
            setCurrentAttendedEventPage(currentAttendedEventPage - 1);
        }
    };

    const leaveEventClicked = async event => {
        // Implement leave event functionality here
    };
    
    const updateEventClicked = async event => {
        // Implement update event functionality here
    };

    const deleteEventClicked = async event => {
        setSelectedEventId(event._id); // Set the selected event ID
        setDeleteEventPopup(true); // Show the delete event popup
    };

    const closeDeleteEventPopup = () => {
        setDeleteEventPopup(false); // Close the delete event popup
    };

    const refreshEvents = async () => {
        await fetchHostEvents(); // Fetch hosted events
        await fetchAttendedEvents(); // Fetch attended events
    };

    return (
        <div className="myEvents-container">
            <div className="row g-0 hostingEvents-row">
               
                <div className="row g-0 MyEvents-Header">
                    <h2>Events You're Hosting</h2>
                    <div className="row g-0 overlay-buttons">
                        <div className="pagination-buttons">
                            <button onClick={prevHostedEventPage} disabled={currentHostedEventPage === 1}>Prev</button>
                            <button onClick={nextHostedEventPage} disabled={currentHostedEventPage === Math.ceil(hostedEvents.length / eventsPerPage)}>Next</button>
                        </div>
                    </div>
                </div>
                
                <div className="row g-0 displayMyEvents-row">
                    {currentHostedEvents.map(event => (
                        <div key={event._id} className="col-4 eventCard-Display">
                            <div className="col eventCard-Img" style={{ backgroundImage: `url(${eventTypeImages[event.Type]})` }}>
                            </div>
                            <div className="col eventCard-Info">
                                <h5>{event.Name}</h5>
                                <p>{event.Time}</p>
                                <p>Location: {event.Location}</p>
                                <p>Event Type: {event.Type}</p>
                                <div className="effectEventButtons">
                                    <button onClick={() => updateEventClicked(event)}>Update</button>
                                    <button onClick={() => deleteEventClicked(event)}>Delete</button>
                                    {showDeleteEventPopup && <DeleteEventPopup show={showDeleteEventPopup} onClose={closeDeleteEventPopup} eventId={selectedEventId} refreshEvents={refreshEvents} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="row g-0 attendingEvents-row">
                <div className="row g-0 MyEvents-Header">
                    <h2>Events You're Attending</h2>
                    <div className="row g-0 overlay-buttons">
                        <div className="pagination-buttons">
                            <button onClick={prevAttendedEventPage} disabled={currentAttendedEventPage === 1}>Prev</button>
                            <button onClick={nextAttendedEventPage} disabled={currentAttendedEventPage === Math.ceil(attendedEvents.length / eventsPerPage)}>Next</button>
                        </div>
                    </div>
                </div>
                <div className="row g-0 displayMyEvents-row">
                    {currentAttendedEvents.map(event => (
                        <div key={event._id} className="col-4 eventCard-Display">
                            <div className="col eventCard-Img" style={{ backgroundImage: `url(${eventTypeImages[event.Type]})` }}>
                            </div>
                            <div className="col eventCard-Info">
                                <h5>{event.Name}</h5>
                                <p>{event.Time}</p>
                                <p>Location: {event.Location}</p>
                                <p>Event Type: {event.Type}</p>
                                <div className="effectEventButtons">
                                    <button onClick={() => leaveEventClicked(event)}>Leave</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <span>{message}</span>
        </div>
    );
}

export default MyEvents;
