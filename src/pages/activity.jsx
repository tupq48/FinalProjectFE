import { Helmet } from 'react-helmet-async';

import { ActivityView } from 'src/sections/activity/view'; 

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Activity | Hệ Thống Quản Lý Hoạt Động Cộng Đồng </title>
      </Helmet>

      <ActivityView />
    </>
  );
}
