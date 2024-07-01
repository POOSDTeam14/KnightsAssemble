import React, { useState } from 'react'
import ChangePassword from './ChangePassword';

function VerificationCode( {show, onClose}) {
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);

    const changePasswordClick = () => {
        setShowChangePasswordPopup(true);
    };

    const closeAllPopups = () => {
        setShowChangePasswordPopup(false);
        onClose(); // Close the ForgetPassword popup as well
    };


    if(!show)
        return null;


    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="close-btn" onClick={onClose}>×</span>
                <img src="https://i.imgur.com/Yl8TFRU.png" alt="Gold Pegasus" />
                <div className="popup-text">
                    <p>Enter Verification Code</p>
                    <input id="emailInput" type="text" placeholder="Verification Code" /><br />
                    <button onClick={changePasswordClick}>Send Verification Code</button>
                    {showChangePasswordPopup && <ChangePassword show={true} onClose={closeAllPopups} />}
                </div>
            </div>
        </div>
    );
}

export default VerificationCode;