export const paths = {
  index: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  },
  home: '/home',
  announcements: {
    index: '/announcements',
    create: '/announcements/create',
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
  forms: {
    index: '/forms',
    create: '/forms/create',
    edit: '/forms/:formId/edit',
    details: '/forms/:formId'
  },
  payments: '/payments',
  files: '/files',
    settings: '/settings',
};
