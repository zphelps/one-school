export const paths = {
  index: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  },
  home: '/home',
  alerts: {
    index: '/alerts',
    create: '/alerts/create',
    edit: '/alerts/:alertId/edit',
    details: '/alerts/:alertId'
  },
  calendar: '/calendar',
  events: '/events',
  groups: {
    index: '/groups',
    create: '/groups/create',
    edit: '/groups/:groupId/edit',
    details: '/groups/:groupId'
  },
  conversations: '/conversations',
  forms: '/forms',
  payments: '/payments',
  files: '/files',
};
