import React, { useState } from 'react'

function ChangePassword( {show, onClose}) {
    if(!show)
        return null;


    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="close-btn" onClick={onClose}>×</span>
                <img src="https://i.imgur.com/nkvjtG6.png" alt="Gold Lock" />
                <div className="popup-text">
                    <p>Enter New Password</p>
                    <input id="newPassword" type="text" placeholder="Password" /><br />
                    <p>Confirm Password</p>
                    <input id = "confirmPassword" type="text" placeholder='Confirm Password'/><br/>
                    <button id = "changePassword">Finalize Password</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;