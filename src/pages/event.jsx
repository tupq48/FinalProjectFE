import { Helmet } from 'react-helmet-async';

import { EventView } from 'src/sections/event/view';

// ----------------------------------------------------------------------

export default function EventPage() {
  return (
    <>
      <Helmet>
        <title> Event | Minimal UI </title>
      </Helmet>

      <EventView />
    </>
  );
}
