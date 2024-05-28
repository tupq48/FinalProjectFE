import { Helmet } from 'react-helmet-async';

import { ActivityView } from 'src/sections/activity/view'; 

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Activity | Minimal UI </title>
      </Helmet>

      <ActivityView />
    </>
  );
}
