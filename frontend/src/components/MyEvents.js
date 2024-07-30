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
            <div className="MyEvents-Header">
                <h1>My Events</h1>
                <div className="displayMyEvents-row">
                    <div className="hostingEvents-row">
                        <h2>Events I am hosting</h2>
                        {getCurrentEvents(hostedEvents, currentHostedEventPage).map((event) => (
                            <div key={event._id} className="eventCard-Display">
                                <div
                                    className="eventCard-Img"
                                    style={{ backgroundImage: `url(${eventImages[event._id]})` }}
                                />
                                <div className="eventCard-Info">
                                    <h5>{event.eventName}</h5>
                                    <p>{event.eventType}</p>
                                    <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                        <div className="pagination-buttons">
                            <button
                                disabled={currentHostedEventPage === 1}
                                onClick={() => handlePageChange(currentHostedEventPage - 1, 'hosted')}
                            >
                                Previous
                            </button>
                            <button
                                disabled={(currentHostedEventPage * eventsPerPage) >= hostedEvents.length}
                                onClick={() => handlePageChange(currentHostedEventPage + 1, 'hosted')}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <div className="attendingEvents-row">
                        <h2>Events I am attending</h2>
                        {getCurrentEvents(attendedEvents, currentAttendedEventPage).map((event) => (
                            <div key={event._id} className="eventCard-Display">
                                <div
                                    className="eventCard-Img"
                                    style={{ backgroundImage: `url(${eventImages[event._id]})` }}
                                />
                                <div className="eventCard-Info">
                                    <h5>{event.eventName}</h5>
                                    <p>{event.eventType}</p>
                                    <button onClick={() => handleLeaveEvent(event._id)}>Leave</button>
                                </div>
                            </div>
                        ))}
                        <div className="pagination-buttons">
                            <button
                                disabled={currentAttendedEventPage === 1}
                                onClick={() => handlePageChange(currentAttendedEventPage - 1, 'attended')}
                            >
                                Previous
                            </button>
                            <button
                                disabled={(currentAttendedEventPage * eventsPerPage) >= attendedEvents.length}
                                onClick={() => handlePageChange(currentAttendedEventPage + 1, 'attended')}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showDeleteEventPopup && (
                <ConfirmationPopup
                    title="Delete Event"
                    message="Are you sure you want to delete this event?"
                    onConfirm={() => {
                        setShowDeleteEventPopup(false);
                    }}
                    onCancel={() => setShowDeleteEventPopup(false)}
                />
            )}
            {showLeaveEventPopup && (
                <ConfirmationPopup
                    title="Leave Event"
                    message="Are you sure you want to leave this event?"
                    onConfirm={() => {
                        setShowLeaveEventPopup(false);
                    }}
                    onCancel={() => setShowLeaveEventPopup(false)}
                />
            )}
        </div>
    );
}

export default MyEvents;