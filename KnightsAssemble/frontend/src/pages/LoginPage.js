import React from 'react';

import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import ForgetPassword from '../components/ForgetPassword';
import TopPageLogo from '../components/TopPageLogo';


const LoginPage = () =>
{

    return(
      <div>
        <PageTitle />
        <TopPageLogo />
        <Login />
      </div>
    );
};

export default LoginPage;
