import React, { useState } from 'react'
import ChangePassword from './ChangePassword';

function VerificationCode( {show, onClose, verifyCode, verificationSuccessful, email}) {
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const[message, setMessage] = useState("");

    const verificationButtonClick = async () => {
        if(verificationCode === verifyCode){

            if(window.location.pathname === "/register")
                await verificationSuccessful();
            else{
                onClose();
                setShowChangePasswordPopup(true);
            }
        }
        else
            setMessage("Verification code incorrect!")

    };

    const closeAllPopups = () => {
        setShowChangePasswordPopup(false);
    };


    if(!show && !showChangePasswordPopup)
        return null;


    return (
        <>
            {show && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <span className="close-btn" onClick={onClose}>×</span>
                        <img src="https://i.imgur.com/Yl8TFRU.png" alt="Gold Pegasus" />
                        <div className="popup-text">
                            <p>Verification Code sent to Email</p>
                            <input id="verificationInput" type="text" placeholder="Verification Code" value={verificationCode} onChange={(elem) => setVerificationCode(elem.target.value)}/><br />
                            <span className = "requirementFields">{message}</span>
                            <button className = "popup-button" onClick={verificationButtonClick}>Enter verification code</button>
                        </div>
                    </div>
                </div>
            )}

            {showChangePasswordPopup && (
                <ChangePassword show={true} onClose={closeAllPopups}  email={email}/>
            )}
        </>
    );
}

export default VerificationCode;