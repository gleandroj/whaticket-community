const adminPermissions = [
  "drawer-admin-items:view",
  "tickets-manager:showall",
  "user-modal:editProfile",
  "user-modal:editQueues",
  "user-modal:editCompany",
  "ticket-options:deleteTicket",
  "ticket-options:transferWhatsapp",
  "contacts-page:deleteContact",
  "user-list:edit:admin",
  "user-list:edit:user",
];

const rules = {
  user: {
    static: [],
  },

  admin: {
    static: adminPermissions,
  },

  superAdmin: {
    static: [
      ...adminPermissions,
      "drawer-admin-items:companies:view",
      "user-list:edit:superAdmin",
    ],
  },
};

export default rules;
