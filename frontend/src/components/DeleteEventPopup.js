import React, { useState } from 'react'
import ChangePassword from './ChangePassword';
import { jwtDecode } from "jwt-decode";
const { retrieveToken, retrieveEventID } = require('../storage.js');

function DeleteEventPopup( {show, onClose, refreshEvents}) {
    const[message, setMessage] = useState("");

    let bp = require('./Path.js');
    
    const deleteEventVerification = async () => {
        
        let token = retrieveToken();
        let eventId = retrieveEventID();

        var obj = {
            eventid: eventId,
            token: token
        };
        let js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('api/deleteEvent'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            let res = JSON.parse(await response.text());

            if ('error' in res) {
                setMessage(res.error);
            } else {
                setMessage('');
                refreshEvents();
            }
        } catch (e) {
            alert(e.toString());
            return;
        }      
        onClose();  
    };

    const closeDeleteEventVerification = () => {
        onClose(); 
    };


    if(!show)
        return null;


    return (
        <div className = "updateEventStatus-PopUp">

            <div className = "row g-0 updateEventStatus-Content">

                <div className = "col updateEventStatus-text">

                    <p>Confirm Delete Event</p>

                </div>

                <div className = "col updateEventStatus-Buttons">

                    <button id = "updateEventStatus-Yes" onClick={deleteEventVerification}>Yes</button>
                    <button id = "updateEventStatus-No" onClick={closeDeleteEventVerification}>No</button>

                </div>

            </div>


        </div>
    );
}

export default DeleteEventPopup;