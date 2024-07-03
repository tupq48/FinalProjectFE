import { Helmet } from 'react-helmet-async';

import { RegisterAiModelView } from 'src/sections/ai-model/view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Identification | HĐCĐ </title>
      </Helmet>

      <RegisterAiModelView />
    </>
  );
}
