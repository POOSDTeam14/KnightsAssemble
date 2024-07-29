import React, { useState } from 'react'

function VerificationCode( {show, onClose, verifyCode, verificationSuccessful, email}) {
    const [verificationCode, setVerificationCode] = useState("");

    const[message, setMessage] = useState("");

    const verificationButtonClick = async () => {
        if(verificationCode === verifyCode){

            if(window.location.pathname === "/register")
                await verificationSuccessful();
            else{
                onClose(false);
            }
        }
        else
            setMessage("Verification code incorrect!")

    };


    if(!show)
        return null;


    return (
        <>
            {show && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <span className="close-btn" onClick={() => onClose(true)}>×</span>
                        <img className="ucfImg" src="https://i.imgur.com/Yl8TFRU.png" alt="Gold Pegasus" />
                        <p className="popup-text">Verification code</p>
                        <input id="login-emailInput" type="text" placeholder="Verification code" value={verificationCode} onChange={(elem) => setVerificationCode(elem.target.value)}/>
                        <span className = "requirementFields">{message}</span>
                        <button className = "popup-button" onClick={verificationButtonClick}>Enter verification code</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default VerificationCode;