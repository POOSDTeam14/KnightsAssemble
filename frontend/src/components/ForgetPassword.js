import React, { useState } from 'react';
import VerificationCode from './VerificationCode';

function ForgetPassword({ show, onClose }) {
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);
     
    //Email Requirements Message
    const [emailRequirementNotMet, setEmailRequirementNotMet] = useState("");
    
    const [email, setEmail] = useState('');

    const handleVerification = () => {
        //Validate Email Format
        const emailRequirement = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if(!emailRequirement)
            setEmailRequirementNotMet("Email Address is Not Valid")      
        else
            setShowVerificationPopup(true);
    };

    const closeAllPopups = () => {
        setEmail("");
        setEmailRequirementNotMet("");
        setShowVerificationPopup(false);
        onClose(); // Close the ForgetPassword popup as well
    };

    if (!show) 
        return null; 

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="close-btn" onClick={onClose}>×</span>
                <img src="https://i.imgur.com/Yl8TFRU.png" alt="Gold Pegasus" />
                <div className="popup-text">
                    <p>Enter Email Address</p>
                    <input id="login-emailInput" type="text" placeholder="Email" value={email} onChange={(elem) => setEmail(elem.target.value)}/><br />
                    <span className = "requirementFields">{emailRequirementNotMet}</span>
                    <button className = "popup-button" onClick={handleVerification}>Send Verification Code</button>
                    {showVerificationPopup && <VerificationCode show={true} onClose={closeAllPopups} />}
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
