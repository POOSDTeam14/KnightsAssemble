import React, { useState } from 'react';
import VerificationCode from './VerificationCode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgetPassword.css';

function ForgetPassword({ show, onClose }) {
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState('');

    let bp = require('./Path.js');

    const handleVerification = async event => {
        const emailRequirement = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailRequirement) {
            setMessage("Email is not valid.");
        } else {
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
        onClose();
    };

    if (!show) return null;

    return (
        <div className="popup-overlay d-flex justify-content-center align-items-center">
            <div className="popup-content bg-dark text-light p-4 rounded position-relative">
                <button type="button" className="close text-light position-absolute top-0 end-0 p-3" aria-label="Close" onClick={closeAllPopups}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <img src="https://i.imgur.com/Yl8TFRU.png" alt="Gold Pegasus" className="img-fluid mx-auto d-block mb-4 popup-image" />
                <div className="popup-text text-center">
                    <p>Email</p>
                    <input
                        id="login-emailInput"
                        type="text"
                        className="form-control mb-2"
                        placeholder="Email"
                        value={email}
                        onChange={(elem) => setEmail(elem.target.value)}
                    />
                    <span className="requirementFields text-danger">{message}</span>
                    <button className="btn btn-gold mt-3 w-100" onClick={handleVerification}>Send Verification Code</button>
                    {showVerificationPopup && <VerificationCode show={true} onClose={closeAllPopups} verifyCode={verifyCode} email={email} />}
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;