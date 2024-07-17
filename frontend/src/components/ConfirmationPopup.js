import React, { useState } from 'react'
import ChangePassword from './ChangePassword';
import { jwtDecode } from "jwt-decode";
const { retrieveToken, retrieveEventID } = require('../storage.js');

function ConfirmationPopup( {show, onClose, refreshEvents, deleteEvent}) {
    const[message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    let bp = require('./Path.js');
    
    const removeEventVerification = async () => {
        setIsLoading(true); 
        let token = retrieveToken();
        let eventId = retrieveEventID();
        let userId = jwtDecode(token).userInfo.userid;
        
        //Delete Event
        if(deleteEvent){
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
                    await refreshEvents(); 
                }
            } catch (e) {
                alert(e.toString());
            } finally {
                setIsLoading(false); 
                onClose(); 
            }
        }

        //Leave Event
        else{
            var obj = {
                eventid: eventId,
                userid: userId,
                token: token
            };
            let js = JSON.stringify(obj);
        
            try {
                const response = await fetch(bp.buildPath('api/leaveEvent'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });
        
                let res = JSON.parse(await response.text());
        
                if ('error' in res) {
                    setMessage(res.error);
                } else {
                    setMessage('');
                    await refreshEvents(); 
                }
            } catch (e) {
                alert(e.toString());
            } finally {
                setIsLoading(false); 
                onClose(); 
            }
        }
    };

    const closeRemoveEventVerification = () => {
        onClose(); 
    };


    if(!show)
        return null;


    return (
        <div className="updateEventStatus-PopUp">
            <div className="row g-0 updateEventStatus-Content">
                <div className="col updateEventStatus-text">
                    <p>
                        {deleteEvent
                        ? (isLoading ? "Deleting event..." : "Confirm Delete Event")
                        : (isLoading ? "Leaving event..." : "Confirm Leave Event")
                        }
                    </p>
                </div>
                <div className="col updateEventStatus-Buttons">
                    <button id="updateEventStatus-Yes" onClick={removeEventVerification} disabled={isLoading}>
                        Yes
                    </button>
                    <button id="updateEventStatus-No" onClick={closeRemoveEventVerification} disabled={isLoading}>
                        No
                    </button>
                    <span className = "requirementFields">{message}</span>
                </div>
            </div>
        </div>
    );
    
}

export default ConfirmationPopup;