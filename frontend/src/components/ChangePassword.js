import React, { useState } from 'react'

function ChangePassword( {show, onClose, email}) {
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

    let bp = require('./Path.js');
    
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
            setMessage("Both fields must be filled!");
            return;
        }

        //Check if passwords match
        if(password !== confirmPassword){
            setMessage("Passwords must match!");
            return;
        }

        /******** Check Password Requirements ************/
        const testRequirements = validatePassword(password);
        let validPassword = true;
        

        if(!testRequirements.isLengthMet){
            setlengthNotMet("Password Length Must Be 8-16 Characters");
            validPassword = false;
        }

        

        if(!testRequirements.isDigitMet){
            setDigitNotMet("Password Must Contain At Least One Digit");
            validPassword = false;
        }

        

        if(!testRequirements.isUpperCaseMet){
            setUpperCaseNotMet("Password Must Contain At Least One UpperCase Letter");
            validPassword = false;
        }

        
        if(!testRequirements.isLowerCaseMet){
            setLowerCaseNotMet("Password Must Contain At Least One LowerCase Letter");
            validPassword = false;
        }

        if(validPassword){
            var obj = {
                email: email,
                password: confirmPassword
            };
            let js = JSON.stringify(obj);
            try {
                const response = await fetch(bp.buildPath('api/updatePassword'), {
                    method: 'PUT',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });
                
                let res = JSON.parse(await response.text());
                
                if ('error' in res) {
                    setMessage(res.error);
                } else {
                    setPasswordSuccessful("Password Change Successful")
                }
            } catch (e) {
                alert(e.toString());
                return;
            }
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
                <span className="close-btn" onClick={() => onClose(true)}>×</span>
                <img id= "ucfImg" src="https://i.imgur.com/Yl8TFRU.png" alt="Gold Pegasus" />
                <p className="popup-text">New password</p>
                <input id="login-newPassword" type="password" placeholder="Password" value = {password} onChange={(elem) => setPassword(elem.target.value)}/>
                <p className="popup-text">Confirm password</p>
                <input id = "login-confirmPassword" type="password" placeholder='Confirm password' value = {confirmPassword} onChange={(elem) => setConfirmPassword(elem.target.value)}/>
                <span className = "passwordInputsError">{message}</span>
                <span style={{ color: 'green' }}>{passwordSuccessful}</span>
                <span className = "requirementFields">{lengthNotMet}</span>
                <span className="requirementFields">{lowerCaseNotMet}</span>
                <span className = "requirementFields">{upperCaseNotMet}</span>
                <span className = "requirementFields">{digitNotMet}</span>
                <button className="popup-button" id= "popup-button" onClick={doChangePassword}>Change password</button>
            </div>
        </div>
    );
}

export default ChangePassword;