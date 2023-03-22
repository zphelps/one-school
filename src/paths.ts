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
  groups: {
    index: '/groups',
    create: '/groups/create',
    edit: '/groups/:groupId/edit',
    details: '/groups/:groupId'
  },
  conversations: {
    index: '/conversations',
    create: '/conversations/create',
    details: '/conversations/:conversationId'
  },
  forms: '/forms',
  payments: '/payments',
  files: '/files',
};
