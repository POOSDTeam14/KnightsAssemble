import React, { useState } from 'react';
import VerificationCode from './VerificationCode';

function ForgetPassword({ show, onClose }) {
    //Verification Popup
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
     
    //Requirements Message
    const [message, setMessage] = useState("");
    
    //Email Input
    const [email, setEmail] = useState('');
    
    let bp = require('./Path.js');

    const handleVerification = async event => {
        //Validate Email Format
        const emailRequirement = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if(!emailRequirement)
            setMessage("Email Address is not valid")      
        else{
            var obj = {
                email: email
            };
            let js = JSON.stringify(obj);
            try {
                const response = await fetch(bp.buildPath('api/forgotPassword'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });
                
                let res = JSON.parse(await response.text());
                
                if ('error' in res) {
                    setMessage(res.error);
                } else {
                    setVerifyCode(res.verifyCode);
                    setShowVerificationPopup(true);
                }
            } catch (e) {
                alert(e.toString());
                return;
            }
        }
    };

    const closeAllPopups = () => {
        setEmail("");
        setMessage("");
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
                    <span className = "requirementFields">{message}</span>
                    <button className = "popup-button" onClick={handleVerification}>Send Verification Code</button>
                    {showVerificationPopup && <VerificationCode show={true} onClose={closeAllPopups} verifyCode={verifyCode} email = {email} />}
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
