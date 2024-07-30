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
      
        // Format date as YYYY-MM-DD and time as HH:MM
        const year = estTime.getFullYear();
        const month = String(estTime.getMonth() + 1).padStart(2, '0'); 
        const day = String(estTime.getDate()).padStart(2, '0');
        const formattedDate = `${month}/${day}/${year}`;
      
        // Format time as HH:MM AM/PM
        let hours = estTime.getHours();
        const minutes = String(estTime.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      
        return { formattedDate, formattedTime };
      }
    
    
    function getRandomImage(images) {
        return images[Math.floor(Math.random() * images.length)];
    }

    function initializeEventImages(events, type) {
        const newEventImages = {};
        events.forEach(event => {
            if (!eventImages[event._id]) {
                newEventImages[event._id] = getRandomImage(eventTypeImages[event.Type]);
            }
        });
        setEventImages(prevImages => ({ ...prevImages, ...newEventImages }));
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

    const leaveEventClicked = async (event, e) => {
        e.stopPropagation(); // Prevent parent click event from firing
        storeEventID(event._id);
        setShowLeaveEventPopup(true);
    };
    
    const updateEventClicked = async (event, e) => {
        e.stopPropagation(); // Prevent parent click event from firing
        storeEventID(event._id);
        window.location.href = '/updateevent';
    };
    
    const deleteEventClicked = async (event, e) => {
        e.stopPropagation(); // Prevent parent click event from firing
        storeEventID(event._id);
        setShowDeleteEventPopup(true); // Show the delete event popup
    };

    const closeConfirmationPopup = () => {
        setShowDeleteEventPopup(false); // Close the delete event popup
        setShowLeaveEventPopup(false);
    };

    const refreshEvents = async () => {
        await fetchHostEvents(); // Fetch hosted events
        await fetchAttendedEvents(); // Fetch attended events
    };

    const goToEventDetails = (e) => {
        storeEventID(e);
        window.location.href = '/eventdetails';
    }

    return (
        <div className="myEvents-container">
            <div className="row g-0 hostingEvents-row">
                <div className="row g-0 MyEvents-Header">
                    <h3>Events you're hosting</h3>
                    <div className="row g-0 overlay-buttons">
                        <div className="pagination-buttons">
                            <button onClick={prevHostedEventPage} disabled={currentHostedEventPage === 1}>Prev</button>
                            <button onClick={nextHostedEventPage} disabled={currentHostedEventPage === Math.ceil(hostedEvents.length / eventsPerPage) || hostedEvents.length === 0}>Next</button>
                        </div>
                    </div>
                </div>
                
                <div className="row g-0 displayMyEvents-row">
                    {currentHostedEvents.map(event => (
                        <button key={event._id} onClick={() => goToEventDetails(event._id)} className="col-3-5 eventCard-Display">
                            <div className="col eventCard-Img" style={{ backgroundImage: `url(${eventImages[event._id]})` }}>
                            </div>
                            <div className="col eventCard-Info">
                                <h5>{event.Name}</h5>
                                <p>{convertUTCtoEST(event.Time).formattedDate}</p>
                                <p>{convertUTCtoEST(event.Time).formattedTime}</p>
                                <p>{event.Location}</p>
                                <p>Type: {event.Type}</p>
                                <div className="effectEventButtons">
                                    <button onClick={(e) => updateEventClicked(event, e)}>Update</button>
                                    <button onClick={(e) => deleteEventClicked(event, e)}>Delete</button>
                                </div>
                            </div>
                        </button>
                    ))}
                    {showDeleteEventPopup && <ConfirmationPopup show={showDeleteEventPopup} onClose={closeConfirmationPopup} refreshEvents={refreshEvents} deleteEvent={showDeleteEventPopup}/>}
                </div>
            </div>

            <div className="row g-0 attendingEvents-row">
                <div className="row g-0 MyEvents-Header">
                    <h3>Events you're attending</h3>
                    <div className="row g-0 overlay-buttons">
                        <div className="pagination-buttons">
                            <button onClick={prevAttendedEventPage} disabled={currentAttendedEventPage === 1}>Prev</button>
                            <button onClick={nextAttendedEventPage} disabled={currentAttendedEventPage === Math.ceil(attendedEvents.length / eventsPerPage) || attendedEvents.length === 0}>Next</button>
                        </div>
                    </div>
                </div>
                <div className="row g-0 displayMyEvents-row">
                    {currentAttendedEvents.map(event => (
                        <button key={event._id} onClick={() => goToEventDetails(event._id)} className="col-3-5 eventCard-Display">
                            <div className="col eventCard-Img" style={{ backgroundImage: `url(${eventImages[event._id]})` }}>
                            </div>
                            <div className="col eventCard-Info">
                                <h5>{event.Name}</h5>
                                <p>{convertUTCtoEST(event.Time).formattedDate}</p>
                                <p>{convertUTCtoEST(event.Time).formattedTime}</p>
                                <p>{event.Location}</p>
                                <p>Type: {event.Type}</p>
                                <div className="effectEventButtons">
                                <button onClick={(e) => leaveEventClicked(event, e)}>Leave</button>
                                </div>
                            </div>
                        </button>
                    ))}
                    {showLeaveEventPopup && <ConfirmationPopup show={showLeaveEventPopup} onClose={closeConfirmationPopup} refreshEvents={refreshEvents} deleteEvent={showDeleteEventPopup}/>}
                </div>
            </div>
        </div>
    );
}

export default MyEvents;
