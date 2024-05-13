import { Helmet } from 'react-helmet-async';

import { ProFileView } from 'src/sections/profile/view';


// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Profile | Minimal UI </title>
      </Helmet>

      <ProFileView />
    </>
  );
}
