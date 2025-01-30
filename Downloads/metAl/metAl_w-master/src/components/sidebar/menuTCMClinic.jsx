const Menu = [
  {
    path: "aivoluon.com",
    icon: "fas fa-globe text-green",
    title: "aivoluon.com",
  },
  {
    path: "/Calendar & Planning",
    icon: "fa fa-calendar text-yellow",
    title: "Calendar & Planning",
    badge: "10",
    children: [
      { path: "/calendar", icon: "fa fa-calendar", title: "Calendar" },
      { path: "/calendar/appointments", title: "Appointments" },
      {
        path: "/calendar/reqforappointments",
        title: "Requests for Appointments",
      },
      { path: "/calendar/appointments/new", title: "Add Appointment" },
      { path: "/calendar/scheduler", title: "Team-scheduler" },
      { path: "/scheduler", title: "scheduler" },
      {
        path: "/planning/reqforappointments",
        title: "Requests for Appointments",
      },
    ],
  },

  {
    path: "/Users",
    icon: "fa fa-address-book text-lime",
    title: "Users",
    badge: "10",
    children: [
      { path: "/user/doctors", title: "Doctors" },
      { path: "/user/doctors/new", title: "Add doctor" },
      { path: "/user/search_doctor", title: "Search in Doctors" },
      { path: "/user/receptions", title: "Receptions" },
      { path: "/user/receptions/new", title: "Add reception" },
      { path: "/user/search_reception", title: "Search in Receptions" },
      { path: "/user/accountants", title: "Accountants" },
      { path: "/user/accountants/new", title: "Add accountant" },
      { path: "/user/search_accountant", title: "Search in Accountants" },
      { path: "/user/patients", title: "Patients" },
      { path: "/user/patients/new", title: "Add patient" },
      { path: "/user/search_patient", title: "Search in Patients" },
      { path: "/user/search_user", title: "Search in Users" },
      { path: "/user/contacts", title: "Contacts" },
    ],
  },

  {
    path: "/Human Resources",
    icon: "fa fa-graduation-cap text-creme",
    title: "Human Resources",
    badge: "10",
    children: [
      { path: "/user/skills", title: "Skills" },
      { path: "/planning/admincertificates", title: "Admin of Certifications" },
      { path: "/user/shifts", title: "Shifts" },
      { path: "/ero/incidents", title: "Incidents" },
      { path: "/user/attendances", title: "Attendances" },
      { path: "/user/userroles", title: "UserRoles" },
      { path: "/user/userroles/new", title: "Add New UserRole" },
      { path: "/user/rightspermissions", title: "Rights & Permissions" },
      {
        path: "/user/rightspermissions/new",
        title: "Add new Rights & Permissions",
      },
      { path: "/planning/adminskills", title: "Admin Skills" },
      { path: "/planning/admincertificates", title: "Admin Certificates" },
      { path: "/user/adminshifts", title: "Admin Shifts" },
      { path: "/user/leaves", title: "Leaves" },
      { path: "/planning/leavesreasons", title: "Admin Leave-Reasons" },
      { path: "/planning/adminskills", title: "Admin Skills" },
    ],
  },

  {
    path: "/Medicalfiles",
    icon: "fa fa-medkit",
    title: "Medical Files",
    badge: "10",
    children: [
      { path: "/clinic/medicalfiles", title: "Medical Files" },
      { path: "/clinic/tcmsessions/new", title: "Add session" },
      { path: "/clinic/physicalconditions", title: "Physical conditions" },
      {
        path: "/clinic/physicalconditions/new",
        title: "Add Physical condition",
      },
      { path: "/clinic/search_medicalfile", title: "Search in Medical Files" },
    ],
  },

  {
    path: "/drive",
    icon: "fa fa-cloud text-lightpink",
    title: "Yourdrive",
    badge: "10",
    children: [
      { path: "/drive/yourdrive", title: "yourdrive" },
      { path: "/drive/search_yourdrive", title: "Search in your drive" },
    ],
  },

  {
    path: "/Accounting",
    icon: "fas fa-balance-scale text-cyan",
    title: "Accounting",
    badge: "10",
    children: [
      { path: "/accounting/accountingsetting", title: "Setting" },
      { path: "/accounting/invoices", title: "Invoices" },
      { path: "/accounting/invoices/new", title: "Add Invoice" },
      { path: "/accounting/expenses", title: "Expenses" },
      { path: "/accounting/expenses/new", title: "Add Expense" },
      { path: "/accounting/transactions", title: "Transactions" },
      { path: "/accounting/transactions/new", title: "Add transaction" },
      { path: "/accounting/COAs", title: "COAs" },
      { path: "/accounting/NCOAs", title: "COAs" },
      { path: "/accounting/COAs/new", title: "Add COA" },
      { path: "/accounting/services", title: "Services" },
      { path: "/accounting/services/new", title: "Add Service" },
      { path: "/accounting/products", title: "Products" },
      { path: "/accounting/products/new", title: "Add Product" },
      {
        path: "/accounting/profitlossstatement",
        title: "Profit vs Loss Statement",
      },
      { path: "/accounting/charts", title: "Charts" },
    ],
  },

  {
    path: "/forum-front",
    icon: "fa fa-hospital text-navy",
    title: "Forum",
    children: [
      { path: "/forum/forum", title: "Forum" },
      { path: "/forum/postcompose", title: "Post compose" },
      { path: "/forum/postdetail", title: "Post Detail" },
      { path: "/forum/forumMeryem", title: "Forums Meryem" },
      { path: "/forum/topics", title: "Admin Topics" },
      { path: "/forum/categories", title: "Admin Categories" },
      { path: "/forum/posts", title: "Admin Posts" },

      { path: "/forum-front/forums", title: "Forums" },
      { path: "/forum-front/postcompose", title: "Post compose" },
      { path: "/forum-front/postdetail", title: "Post Detail" },
      { path: "/forum-front1/postcompose", title: "Post compose 1" },
      { path: "/forum-front1/postdetail", title: "Post Detail 1" },

      { path: "/forum-front2/compose", title: "Post compose 2" },
      { path: "/forum-front2/postdetail", title: "Post Detail 2" },
      { path: "/forum-front2/ForumBody", title: "ForumBody" },
      { path: "/forum-front2/createpost", title: "Create Post" },
      { path: "/forum-front2/Modal", title: "Modal" },

      { path: "/forum", title: "Forum task 1A" },
    ],
  },

  {
    path: "/Ticket",
    icon: "fas fa-ticket-alt text-olive",
    title: "Tickets",
    badge: "10",
    children: [
      { path: "/ticket/tickets", title: "Tickets" },
      { path: "/ticket/tickets/new", title: "Add Ticket" },
      { path: "/ticket/grid-tickets", title: "Gridview of Tickets" },
      { path: "/ticket/timelinetickets", title: "Timeline of Tickets" },
      { path: "/ticket/search_tickets", title: "Search in Tickets" },
      { path: "/user/ticketsa", title: "Ticketsa" },
    ],
  },
];

export default Menu;
