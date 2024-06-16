import { Helmet } from 'react-helmet-async';

import { UserEventView } from 'src/sections/event/view';

// ----------------------------------------------------------------------

export default function UserEventPage() {
  return (
    <>
      <Helmet>
        <title> Event | HĐCĐ </title>
      </Helmet>

      <UserEventView />
    </>
  );
}
