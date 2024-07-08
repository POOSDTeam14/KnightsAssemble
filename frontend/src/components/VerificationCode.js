import React, { useState } from 'react'
import ChangePassword from './ChangePassword';

function VerificationCode( {show, onClose, verifyCode, verificationSuccessful}) {
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const verificationButtonClick = async () => {
        if(window.location.pathname === "/register"){
            if(verificationCode === verifyCode)
                await verificationSuccessful();
        }
        else
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
                    <p>Verification Code sent to Email</p>
                    <input id="verificationInput" type="text" placeholder="Verification Code" value={verificationCode} onChange={(elem) => setVerificationCode(elem.target.value)}/><br />
                    <button className = "popup-button" onClick={verificationButtonClick}>Enter Verification Code</button>
                    {showChangePasswordPopup && <ChangePassword show={true} onClose={closeAllPopups} />}
                </div>
            </div>
        </div>
    );
}

export default VerificationCode;