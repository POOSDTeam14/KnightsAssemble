import React, { useState } from 'react';
import VerificationCode from './VerificationCode';
import ChangePassword from './ChangePassword';

function ForgetPassword({ show, onClose }) {
    // Verification Popup
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
     
    // Requirements Message
    const [message, setMessage] = useState("");
    
    // Email Input
    const [email, setEmail] = useState('');

    
    let bp = require('./Path.js');

    const handleVerification = async event => {
        event.preventDefault();
        // Validate Email Format
        const emailRequirement = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailRequirement) {
            setMessage("Email Address is not valid");
            return;
        }

        var obj = { email: email };
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
                onClose(); 
                setShowVerificationPopup(true); 
            }
        } catch (e) {
            alert(e.toString());
        }
    };

    const closeAllPopups = async closeAll => {
        setEmail("");
        setMessage("");

        setShowVerificationPopup(false);
        if(!closeAll)
            setShowChangePasswordPopup(true);
        else
            setShowChangePasswordPopup(false);
    };

    if (!show && !showVerificationPopup && !showChangePasswordPopup) 
        return null; 

    return (
        <>
            {show && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <span className="close-btn" onClick={onClose}>×</span>
                        <img className="ucfImg" src="https://i.imgur.com/Yl8TFRU.png" alt="Gold Pegasus" />
                        <p className="popup-text">Email</p>
                        <input
                            id="login-emailInput"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(elem) => setEmail(elem.target.value)}
                        />
                        <span className="requirementFields">{message}</span>
                        <button className="popup-button" onClick={handleVerification}>
                            Send verification code
                        </button>
                    </div>
                </div>
            )}
            {showVerificationPopup && (
                <VerificationCode show={showVerificationPopup} onClose={closeAllPopups} verifyCode={verifyCode} email={email}/>
            )}
            {showChangePasswordPopup && (
                <ChangePassword show={showChangePasswordPopup} onClose={closeAllPopups}  email={email}/>
            )}
        </>
    );
}

export default ForgetPassword;