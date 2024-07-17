import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import ConfirmationPopup from './ConfirmationPopup';
const { retrieveToken, storeEventID } = require('../storage.js');

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

    const [showDeleteEventPopup, setShowDeleteEventPopup] = useState(false);
    const [showLeaveEventPopup, setShowLeaveEventPopup] = useState(false);


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
                setHostedEvents([]);
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
                setAttendedEvents([]);
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
        return estTime.toLocaleString('en-US', { timeZone: 'America/New_York' });
    }
    
    
    

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
      storeEventID(event._id);
      setShowLeaveEventPopup(true);
    };
    
    const updateEventClicked = async event => 
    {
        storeEventID(event._id);
        window.location.href = '/updateevent';
    };

    const deleteEventClicked  = async event => {
        storeEventID(event._id);
        setShowDeleteEventPopup(true); // Show the delete event popup
    };

    const closeConfirmationPopup  = () => {
        setShowDeleteEventPopup(false); // Close the delete event popup
        setShowLeaveEventPopup(false);
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
                            <button onClick={nextHostedEventPage} disabled={currentHostedEventPage === Math.ceil(hostedEvents.length / eventsPerPage) || hostedEvents.length === 0}>Next</button>
                        </div>
                    </div>
                </div>
                
                <div className="row g-0 displayMyEvents-row">
                    {currentHostedEvents.map(event => (
                        <div key={event._id} className="col-3-5 eventCard-Display">
                            <div className="col eventCard-Img" style={{ backgroundImage: `url(${eventTypeImages[event.Type]})` }}>
                            </div>
                            <div className="col eventCard-Info">
                                <h5>{event.Name}</h5>
                                <p>{convertUTCtoEST(event.Time)}</p>
                                <p>{event.Location}</p>
                                <p>Type: {event.Type}</p>
                                <div className="effectEventButtons">
                                    <button onClick={() => updateEventClicked(event)}>Update</button>
                                    <button onClick={() => deleteEventClicked(event)}>Delete</button>
                                    {showDeleteEventPopup && <ConfirmationPopup show={showDeleteEventPopup} onClose={closeConfirmationPopup} refreshEvents={refreshEvents} deleteEvent={showDeleteEventPopup}/>}
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
                            <button onClick={nextAttendedEventPage} disabled={currentAttendedEventPage === Math.ceil(attendedEvents.length / eventsPerPage) || attendedEvents.length === 0}>Next</button>
                        </div>
                    </div>
                </div>
                <div className="row g-0 displayMyEvents-row">
                    {currentAttendedEvents.map(event => (
                        <div key={event._id} className="col-3-5 eventCard-Display">
                            <div className="col eventCard-Img" style={{ backgroundImage: `url(${eventTypeImages[event.Type]})` }}>
                            </div>
                            <div className="col eventCard-Info">
                                <h5>{event.Name}</h5>
                                <p>{convertUTCtoEST(event.Time)}</p>
                                <p>{event.Location}</p>
                                <p>Type: {event.Type}</p>
                                <div className="effectEventButtons">
                                    <button onClick={() => leaveEventClicked(event)}>Leave</button>
                                    {showLeaveEventPopup && <ConfirmationPopup show={showLeaveEventPopup} onClose={closeConfirmationPopup} refreshEvents={refreshEvents} deleteEvent={showDeleteEventPopup}/>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyEvents;
