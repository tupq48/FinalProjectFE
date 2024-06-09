import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'event',
    path: '/admin/event',
    icon: icon('ic_event'),
    role: 'admin',
  },
  {
    title: 'User',
    path: '/admin/user',
    icon: icon('ic_user'),
    role: 'admin',
  },
  {
    title: 'Event',
    path: '/event',
    icon: icon('ic_event'),
    role: 'user',
  },
  {
    title: 'Profile',
    path: 'profile',
    icon: icon('ic_blog'),
    role:'all'
  },
  {
    title: 'Activity',
    path: 'activity',
    icon: icon('ic_blog'),
    role:'user'
  },
  {
    title: 'Model AI',
    path: 'ai-model',
    icon: icon('ic_blog'),
    role:'user'
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
