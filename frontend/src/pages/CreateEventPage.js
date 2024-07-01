import React from 'react';

import PageTitle from '../components/PageTitle';
import TopPageLogo from '../components/TopPageLogo';
import CreateEvent from '../components/CreateEvent';


const CreateEventPage = () =>
{

    return(
      <div>
        <PageTitle />
        <TopPageLogo />
        <CreateEvent />
      </div>
    );
};

export default CreateEventPage;
