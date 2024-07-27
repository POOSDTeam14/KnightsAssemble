import React, { useState } from 'react';
import ForgetPassword from './ForgetPassword.js';
const { storeToken } = require('../storage.js');

function Login() {
  let loginName;
  let loginPassword;

  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  let bp = require('./Path.js');

  const doLogin = async (event) => {
    event.preventDefault();

    var obj = { username: loginName.value, password: loginPassword.value };
    let js = JSON.stringify(obj);

    try {
      const response = await fetch(bp.buildPath('api/login'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      let res = JSON.parse(await response.text());

      if ('error' in res) {
        setMessage(res.error);
      } else {
        storeToken(res);

        setMessage('');
        window.location.href = '/events';
      }
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  const forgetPasswordClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="row g-0 loginRow">
      <div className="col h-100">
        <div className="left-login"></div>
      </div>

      <div className="col h-100">
        <div className="right-login">
          <h1 id="signIn-heading">Sign In</h1>
          <h2 id="signIn-subheader">
            New to Knights Assemble?{' '}
            <a href="/register" className="links">
              Create an account
            </a>
          </h2>
          <p id="username-text">Username</p>
          <input
            type="text"
            id="loginName"
            placeholder="Username"
            ref={(elem) => (loginName = elem)}
          />
          <p id="password-text">Password</p>
          <input
            type="password"
            id="loginPassword"
            placeholder="Password"
            ref={(elem) => (loginPassword = elem)}
          />
          <a
            id="forgot-password"
            className="links"
            onClick={forgetPasswordClick}
          >
            Forgot password?
          </a>
          <ForgetPassword show={showPopup} onClose={closePopup} />
          <button id="loginButton" onClick={doLogin}>
            Sign in
          </button>
          <span id="loginResult">{message}</span>
        </div>
      </div>
    </div>
  );
}

export default Login;