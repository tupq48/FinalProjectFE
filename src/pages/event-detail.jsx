import { Helmet } from 'react-helmet-async';

import { EventDetailView } from 'src/sections/event/view';

// ----------------------------------------------------------------------

export default function EventDetailPage() {
  return (
    <>
      <Helmet>
        <title> Event Detail | HĐCĐ </title>
      </Helmet>

      <EventDetailView />
    </>
  );
}
