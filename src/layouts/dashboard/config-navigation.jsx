import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
    role: 'all',
  },
  {
    title: 'user',
    path: '/admin/user',
    icon: icon('ic_user'),
    role: 'admin',
  },
  {
    title: 'event',
    path: '/admin/event',
    icon: icon('ic_event'),
    role: 'admin',
  },
  {
    title: 'event',
    path: '/event',
    icon: icon('ic_event'),
    role: 'user',
  },
  {
    title: 'product',
    path: '/admin/products',
    icon: icon('ic_cart'),
    role:'user'
  },
  {
    title: 'blog',
    path: '/admin/blog',
    icon: icon('ic_blog'),
    role:'user'
  },
  // {
  //   title: 'profile',
  //   path: 'profile',
  //   icon: icon('ic_blog'),
  //   role:'all'
  // },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
    role: 'all',
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
