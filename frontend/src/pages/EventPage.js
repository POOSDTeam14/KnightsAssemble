import React from 'react';

import PageTitle from '../components/PageTitle';
import TopPageLogo from '../components/TopPageLogo';
import EventsUI from '../components/EventsUI';
import VerticalTabColumn from '../components/VerticalTabColumn';


const EventPage = () =>
{

    return(
      <div className = "container-fluid vh-100 p-0">
        <div className = "row g-0">
          <div className = "col">
            <PageTitle />
            <TopPageLogo />
          </div>
        </div>
        <div className = "row g-0">
        <div className="col-2" style={{ minWidth: "110px", maxWidth: "110px" }}>
            <VerticalTabColumn />
          </div>
          <div className = "col">
            <EventsUI />
          </div>
        </div>
      </div>
    );
};

export default EventPage;