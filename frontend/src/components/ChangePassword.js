import React, { useState } from 'react'

function ChangePassword( {show, onClose}) {
    //Password Requirements Message
    const [lengthNotMet, setlengthNotMet] = useState("");
    const [upperCaseNotMet, setUpperCaseNotMet] = useState("");
    const [lowerCaseNotMet, setLowerCaseNotMet] = useState("");
    const [digitNotMet, setDigitNotMet] = useState("");

    const [message,setMessage] = useState('');
    const [passwordSuccessful, setPasswordSuccessful] = useState('');

    //Input Fields
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    if(!show)
        return null;

    const doChangePassword = async event => {
        setlengthNotMet("");
        setDigitNotMet("");
        setUpperCaseNotMet("");
        setLowerCaseNotMet("");
        setMessage("");
        setPasswordSuccessful("");

        //Check if both fields filled
        if(!password || !confirmPassword){
            setMessage("Both Fields Must Be Filled!");
            return;
        }

        //Check if passwords match
        if(password !== confirmPassword){
            setMessage("Passwords Must Match!");
            return;
        }

        /******** Check Password Requirements ************/
        const testRequirements = validatePassword(password);
        setPasswordSuccessful("Password Change Successful")

        if(!testRequirements.isLengthMet){
            setlengthNotMet("Password Length Must Be 8-16 Characters");
            setPasswordSuccessful("");
        }

        

        if(!testRequirements.isDigitMet){
            setDigitNotMet("Password Must Contain At Least One Digit");
            setPasswordSuccessful("");
        }

        

        if(!testRequirements.isUpperCaseMet){
            setUpperCaseNotMet("Password Must Contain At Least One UpperCase Letter");
            setPasswordSuccessful("");
        }

        
        if(!testRequirements.isLowerCaseMet){
            setLowerCaseNotMet("Password Must Contain At Least One LowerCase Letter");
            setPasswordSuccessful("");
        }

    };

    const validatePassword = (password) => {
        const lengthRequirement = password.length >= 8 && password.length <= 16;
        const upperCaseRequirement = /[A-Z]/.test(password);
        const lowerCaseRequirement= /[a-z]/.test(password);
        const digitRequirement = /[0-9]/.test(password); 

        const requirements = {
            isLengthMet: lengthRequirement,
            isUpperCaseMet: upperCaseRequirement,
            isLowerCaseMet: lowerCaseRequirement,
            isDigitMet: digitRequirement
        };

        return requirements;
    };


    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="close-btn" onClick={onClose}>×</span>
                <img id = "pegasus-ChangePassword" src="https://i.imgur.com/Yl8TFRU.png" alt="Gold Pegasus" />
                <div className="popup-text">
                    <p>Enter New Password</p>
                    <input id="login-newPassword" type="text" placeholder="Password" value = {password} onChange={(elem) => setPassword(elem.target.value)}/><br />
                    <p>Confirm Password</p>
                    <input id = "login-confirmPassword" type="text" placeholder='Confirm Password' value = {confirmPassword} onChange={(elem) => setConfirmPassword(elem.target.value)}/><br/>
                    <span className = "passwordInputsError">{message}</span>
                    <span style={{ color: 'green' }}>{passwordSuccessful}</span>
                    <span className = "requirementFields">{lengthNotMet}</span>
                    <span className = "requirementFields">{upperCaseNotMet}</span>
                    <span className = "requirementFields">{lowerCaseNotMet}</span>
                    <span className = "requirementFields">{digitNotMet}</span>
                    <button className = "popup-button" id = "button-finalizePassword" onClick={doChangePassword}>Finalize Password</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;