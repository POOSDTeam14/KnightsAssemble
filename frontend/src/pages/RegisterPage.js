import React from 'react';

import PageTitle from '../components/PageTitle';
import Register from '../components/Register';
import TopPageLogo from '../components/TopPageLogo';

const RegisterPage = () =>
{

    return(
      <div>
        <PageTitle />
        <TopPageLogo />
        <Register />
      </div>
    );
};

export default RegisterPage;