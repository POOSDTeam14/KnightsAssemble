import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
const { retrieveToken, storeEventID } = require('../storage.js');

const eventTypeImages = {
    Sports: "https://i.imgur.com/SaiXbOK.png",
    Food: "https://i.imgur.com/4SfvabH.png",
    Clubs: "https://i.imgur.com/uWBwSuI.png",
    Academic: "https://i.imgur.com/XW4b06x.png",
    Entertainment: "https://i.imgur.com/ZsBFgO5.png",
    Volunteer: "https://i.imgur.com/yQ3ApTx.png"
}


function EventsUI() {   
    const [message, setMessage] = useState("");
    const [eventType, setEventType] = useState("");
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState([]);

    const eventsPerPage = 8;
    const [currentEventPage, setCurrentEventPage] = useState(1);
    
    let bp = require('./Path.js');
    let token = retrieveToken();

    const initialFetchEvents = async () => {
        var obj = {
            search: search,
            token: token
        };
        let js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('api/searchEvent'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            let res = JSON.parse(await response.text());

            if ('error' in res) {
                setMessage(res.error);
                setEvents([]);
            } else {
                setEvents(res.ret);
                setMessage('');
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    }

    useEffect(() => {
        initialFetchEvents();
    }, []);

    /************* Main Events Top ***************/
    const indexOfLastEvent = currentEventPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    
    const currentEventsTop = events.slice(indexOfFirstEvent, indexOfFirstEvent + 4);
    const currentEventsBottom = events.slice(indexOfFirstEvent + 4, indexOfLastEvent);

    
    const nextEventPage = () => {
        if (currentEventPage < Math.ceil(events.length / eventsPerPage)) {
            setCurrentEventPage(currentEventPage + 1);
        }
    };
    
    const prevEventPage = () => {
        if (currentEventPage > 1) {
            setCurrentEventPage(currentEventPage - 1);
        }
    };


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
    

    return(
        <div className="mainEventsPage-container">
            <div className="row g-0 eventSearchRow">
                
                <label htmlFor="event-type" className="visually-hidden">Event Type</label>
                <select id="event-type" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value="" disabled selected>Event Type</option>
                    <option value="Sports">Sports</option>
                    <option value="Food">Food</option>
                    <option value="Clubs">Clubs</option>
                    <option value="Academic">Academic</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Volunteer">Volunteer</option>
                </select>

                <label htmlFor="event-date" className="visually-hidden">Event Date</label>
                <input id="event-date" type="date" className="dateSearch" />

                <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />

                <button>Search</button>
            </div>

            <div className="row g-0 mainEventsDisplay">

                <div className = "row g-0 mainEventsDisplay-Top">
                    
                    {currentEventsTop.map(event => (
                        <button key={event._id} className="col-2-5 mainEventCard-Display">
                            <div className="col eventCard-Img" style={{ backgroundImage: `url(${eventTypeImages[event.Type]})` }}>
                            </div>
                            <div className="col eventCard-Info">
                                <h5>{event.Name}</h5>
                                <p>{convertUTCtoEST(event.Time)}</p>
                                <p>{event.Location}</p>
                                <p>Type: {event.Type}</p>
                            </div>
                        </button>
                    ))}

                </div>

                <div className = "row g-0 mainEventsDisplay-Bottom">
                    {currentEventsBottom.map(event => (
                        <button key={event._id} className="col-2-5 mainEventCard-Display">
                            <div className="col eventCard-Img" style={{ backgroundImage: `url(${eventTypeImages[event.Type]})` }}>
                            </div>
                            <div className="col eventCard-Info">
                                <h5>{event.Name}</h5>
                                <p>{convertUTCtoEST(event.Time)}</p>
                                <p>{event.Location}</p>
                                <p>Type: {event.Type}</p>
                            </div>
                        </button>
                    ))}
                </div>

            </div>

            <div className="row g-0 mainEventsDisplay-Button">
                <button onClick={prevEventPage} disabled={currentEventPage===1}>Prev</button>
                <button onClick={nextEventPage} disabled={events.length===0 || currentEventPage === Math.ceil(events.length / eventsPerPage)}>Next</button>
            </div>
        </div>
    );
}

export default EventsUI;
