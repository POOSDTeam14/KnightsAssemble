import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
const { retrieveToken, retrieveEventID } = require('../storage.js');

function ConfirmationPopup({ show, onClose, refreshEvents, deleteEvent }) {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    let bp = require('./Path.js');

    const removeEventVerification = async () => {
        setIsLoading(true);
        let token = retrieveToken();
        let eventId = retrieveEventID();
        let userId = jwtDecode(token).userInfo.userid;

        const obj = deleteEvent
            ? { eventid: eventId, token: token }
            : { eventid: eventId, userid: userId, token: token };

        const endpoint = deleteEvent ? 'api/deleteEvent' : 'api/leaveEvent';
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath(endpoint), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
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
    };

    const closeRemoveEventVerification = () => {
        onClose();
    };

    if (!show) return null;

    return (
        <div className="updateEventStatus-PopUp">
            <div className="updateEventStatus-Content">
                <div className="updateEventStatus-text">
                    <p>
                        {deleteEvent
                            ? isLoading
                                ? 'Deleting event...'
                                : 'Are you sure you want to delete the event?'
                            : isLoading
                                ? 'Leaving event...'
                                : 'Are you sure you want to leave the event?'}
                    </p>
                </div>
                <div className="updateEventStatus-Buttons">
                    <button id="updateEventStatus-Yes" onClick={removeEventVerification} disabled={isLoading}>
                        Yes
                    </button>
                    <button id="updateEventStatus-No" onClick={closeRemoveEventVerification} disabled={isLoading}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationPopup;