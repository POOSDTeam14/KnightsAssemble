import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import ConfirmationPopup from './ConfirmationPopup';
const { retrieveToken, storeEventID } = require('../storage.js');

const eventTypeImages = {
    Sports: [
        "https://i.imgur.com/SaiXbOK.png",
        "https://i.imgur.com/taD6UEv.jpeg",
        "https://i.imgur.com/zaulALr.jpeg",
        "https://i.imgur.com/TcxD6P6.jpeg",
        "https://i.imgur.com/XJ7FXfT.jpeg"
    ],
    Food: [
        "https://i.imgur.com/4SfvabH.png",
        "https://i.imgur.com/2ROGwEa.jpeg",
        "https://i.imgur.com/0TrhxQl.jpeg",
        "https://i.imgur.com/5W9ShuG.jpeg",
        "https://i.imgur.com/pwDmIJB.jpeg"
    ],
    Clubs: [
        "https://i.imgur.com/uWBwSuI.png",
        "https://i.imgur.com/qRyaZrO.jpeg",
        "https://i.imgur.com/obSFPk1.jpeg",
        "https://i.imgur.com/rTlbgRx.jpeg",
        "https://i.imgur.com/cxzZtRZ.jpeg"
    ],
    Academic: [
        "https://i.imgur.com/XW4b06x.png",
        "https://i.imgur.com/mXBYiL6.jpeg",
        "https://i.imgur.com/QSudyBb.jpeg",
        "https://i.imgur.com/OOZ2pur.jpeg",
        "https://i.imgur.com/Azzol6b.jpeg"
    ],
    Entertainment: [
        "https://i.imgur.com/ZsBFgO5.png",
        "https://i.imgur.com/E1PMqwU.jpeg",
        "https://i.imgur.com/MNOUbQc.jpeg",
        "https://i.imgur.com/QJzdpiD.jpeg",
        "https://i.imgur.com/D67jKkj.jpeg"
    ],
    Volunteer: [
        "https://i.imgur.com/yQ3ApTx.png",
        "https://i.imgur.com/EnYTTpK.jpeg",
        "https://i.imgur.com/gYtkyES.jpeg",
        "https://i.imgur.com/PRpWnsT.jpeg",
        "https://i.imgur.com/qmzdqRh.jpeg"
    ]
};

function MyEvents() {
    const [message, setMessage] = useState('');
    const [hostedEvents, setHostedEvents] = useState([]);
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [currentHostedEventPage, setCurrentHostedEventPage] = useState(1);
    const [currentAttendedEventPage, setCurrentAttendedEventPage] = useState(1);
    const [eventImages, setEventImages] = useState({});
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
                initializeEventImages(res.ret, 'hosted');
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
                initializeEventImages(res.ret, 'attended');
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    const initializeEventImages = (events, type) => {
        const images = {};

        events.forEach((event) => {
            const eventType = event.eventType;
            const imageList = eventTypeImages[eventType];
            if (imageList) {
                images[event._id] = imageList[Math.floor(Math.random() * imageList.length)];
            }
        });

        if (type === 'hosted') {
            setEventImages(prevImages => ({ ...prevImages, ...images }));
        } else {
            setEventImages(prevImages => ({ ...prevImages, ...images }));
        }
    };

    useEffect(() => {
        fetchHostEvents();
        fetchAttendedEvents();
    }, []);

    const handlePageChange = (page, type) => {
        if (type === 'hosted') {
            setCurrentHostedEventPage(page);
        } else {
            setCurrentAttendedEventPage(page);
        }
    };

    const getCurrentEvents = (events, page) => {
        const start = (page - 1) * eventsPerPage;
        return events.slice(start, start + eventsPerPage);
    };

    const handleDeleteEvent = (eventId) => {
        storeEventID(eventId);
        setShowDeleteEventPopup(true);
    };

    const handleLeaveEvent = (eventId) => {
        storeEventID(eventId);
        setShowLeaveEventPopup(true);
    };

    return (
        <div className="myEvents-container">
            <div className="events-section">
                <div className="section-header">
                    <h3>Events You're Hosting</h3>
                    <div className="pagination-buttons">
                        <button onClick={prevHostedEventPage} disabled={currentHostedEventPage === 1}>Prev</button>
                        <button onClick={nextHostedEventPage} disabled={currentHostedEventPage === Math.ceil(hostedEvents.length / eventsPerPage)}>Next</button>
                    </div>
                </div>
                <div className="events-list">
                    {currentHostedEvents.map(event => (
                        <div key={event._id} className="event-card">
                            <div className="event-card-image" style={{ backgroundImage: `url(${eventImages[event._id]})` }}></div>
                            <div className="event-card-info">
                                <h5>{event.Name}</h5>
                                <p>{convertUTCtoEST(event.Time).formattedDate}</p>
                                <p>{convertUTCtoEST(event.Time).formattedTime}</p>
                                <p>{event.Location}</p>
                                <p>Type: {event.Type}</p>
                                <div className="event-actions">
                                    <button onClick={(e) => updateEventClicked(event, e)}>Update</button>
                                    <button onClick={(e) => deleteEventClicked(event, e)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showDeleteEventPopup && <ConfirmationPopup show={showDeleteEventPopup} onClose={closeConfirmationPopup} refreshEvents={refreshEvents} deleteEvent={showDeleteEventPopup} />}
                </div>
            </div>

            <div className="events-section">
                <div className="section-header">
                    <h3>Events You're Attending</h3>
                    <div className="pagination-buttons">
                        <button onClick={prevAttendedEventPage} disabled={currentAttendedEventPage === 1}>Prev</button>
                        <button onClick={nextAttendedEventPage} disabled={currentAttendedEventPage === Math.ceil(attendedEvents.length / eventsPerPage)}>Next</button>
                    </div>
                </div>
                <div className="events-list">
                    {currentAttendedEvents.map(event => (
                        <div key={event._id} className="event-card">
                            <div className="event-card-image" style={{ backgroundImage: `url(${eventImages[event._id]})` }}></div>
                            <div className="event-card-info">
                                <h5>{event.Name}</h5>
                                <p>{convertUTCtoEST(event.Time).formattedDate}</p>
                                <p>{convertUTCtoEST(event.Time).formattedTime}</p>
                                <p>{event.Location}</p>
                                <p>Type: {event.Type}</p>
                                <div className="event-actions">
                                    <button onClick={(e) => leaveEventClicked(event, e)}>Leave</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showLeaveEventPopup && <ConfirmationPopup show={showLeaveEventPopup} onClose={closeConfirmationPopup} refreshEvents={refreshEvents} deleteEvent={showDeleteEventPopup} />}
                </div>
            </div>
        </div>
    );
}

export default MyEvents;

export default MyEvents;
